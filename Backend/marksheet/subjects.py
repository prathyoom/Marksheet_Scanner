from PIL import Image
import pytesseract
import csv
import cv2
import re
import numpy as np
from scipy import ndimage as nd
import difflib


def preprocess(img):
    img.thumbnail((1700, 1700))

    # skew correction
    wd, ht = img.size
    pix = np.array(img.convert("1").getdata(), np.uint8)
    bin_img = 1 - (pix.reshape((ht, wd)) / 255.0)

    def find_score(arr, angle):
        data = nd.rotate(arr, angle, reshape=False, order=0)
        hist = np.sum(data, axis=1)
        score = np.sum((hist[1:] - hist[:-1]) ** 2)
        return hist, score

    delta = 1
    limit = 5
    angles = np.arange(-limit, limit + delta, delta)
    scores = []

    for angle in angles:
        hist, score = find_score(bin_img, angle)
        scores.append(score)

    best_score = max(scores)
    best_angle = angles[scores.index(best_score)]
    data = nd.rotate(img, best_angle, reshape=False, order=0)
    img = Image.fromarray(data.astype("uint8")).convert("RGB")
    img.save("D:\Xampp\htdocs\php-api\marksheet\images\corrected.jpg")
    img = cv2.imread("D:\Xampp\htdocs\php-api\marksheet\images\corrected.jpg")

    # grayscale conversion
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # denoising
    img = cv2.fastNlMeansDenoising(img, None, 1, 7, 21)

    # scaling image
    img = cv2.resize(img, None, fx=3.5, fy=3.5, interpolation=cv2.INTER_LINEAR)

    # Otsu binarisation
    blur = cv2.GaussianBlur(img, (1, 1), 0)

    ret3, img = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed_img = img
    # cv2.imshow("latest", cv2.resize(img, (960, 540)))
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    # cv2.waitKey(1)
    # canny edge detection
    img = cv2.Canny(img, 100, 200)

    # dilation
    kernel = np.ones((10, 10), np.uint8)
    img = cv2.dilate(img, kernel, iterations=1)

    # finding contours
    contours, hierarchy = cv2.findContours(img, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    largestarea = 0.0
    idx = 0

    # cropping out largest contour
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > largestarea:
            largestarea = area
            idx = cnt

    [x, y, w, h] = cv2.boundingRect(idx)
    crop = processed_img[y : y + h, x : x + w]
    return crop


def extractnum(wrds, i):
    p = []
    flag = 0
    while i < len(wrds):
        if not wrds[i].isnumeric():
            if flag == 1:
                break
        else:
            if flag == 1:
                p.append(" ")
            p.append(wrds[i])
            flag = 1
        i += 1
    s = "".join(p)
    return s


def extractinfo(wrds, i):
    p = []
    flag = 0
    while i < len(wrds):
        if not wrds[i].isalpha():
            if flag == 1:
                break
        else:
            if flag == 1:
                p.append(" ")
            p.append(wrds[i])
            flag = 1
        i += 1
    s = "".join(p)
    return s


keywords = [
    "english",
    "economics",
    "physical",
    "business",
    "accountancy",
    "mathematics",
    "physics",
    "chemistry",
    "computer",
    "biology",
]

key_second = [
    "english",  # English Core
    "physical",  # "Physical Education"
    "business",  # "Business Studies"
    "computer",  # "Computer Science"
]


def postprocess(mystring):
    lines = mystring.split("\n")

    # dictionary for relevant lines
    l = {}

    # dictionary for final result
    ans = {}

    for k in keywords:
        l.setdefault(k, [])
        ans.setdefault(k, [])

    # extracting relevant lines from tesseract output
    for line in lines:
        if len(line) > 0:
            words = re.split(r"\s+|\n|(?<=[a-zA-Z])(?=\d)", line)
            # words = line.split(' ')
            for i in range(len(words)):
                words[i] = words[i].lower()
                result = difflib.get_close_matches(words[i], keywords, 1, 0.75)
                if len(result) > 0:
                    key = result[0]
                    l[key].append(" ".join(words))
                    # l[result[0]].append(line)

    # print(l)
    # extracting relevant information from the dictionary l
    for k in keywords:
        for str in l[k]:
            wrds = str.lower().split(" ")
            result = difflib.get_close_matches(k, wrds, 1, 0.85)

            if k in key_second:
                i = wrds.index(result[0]) + 2
            else:
                i = wrds.index(result[0]) + 1

            while i < len(wrds) and next(
                (chr for chr in wrds[i] if not chr.isalpha()), None
            ):
                i += 1
            if len(result) == 0:
                continue

            ans[k].append(extractinfo(str.split(" "), i))

    return ans


def camelcase(self, words):
    li = []
    for word in words:
        li.append(word[0].upper() + word[1:].lower())
    return li


def main():
    # setting path for pytesseract
    pytesseract.pytesseract.tesseract_cmd = (
        "C:\\Program Files\\Tesseract-OCR\\tesseract"
    )

    print("parsing....")
    f = open("D:\\Xampp\\htdocs\\php-api\\marksheet\\input.csv", "r")
    reader = csv.reader(f)
    o = open("D:\\Xampp\\htdocs\\php-api\\marksheet\\output_marks.csv", "w", newline="")
    writer = csv.writer(o)
    o2 = open(
        "D:\\Xampp\\htdocs\\php-api\\marksheet\\output_marks_columns.csv",
        "w",
        newline="",
    )
    column_writer = csv.writer(o2)
    next(reader)

    header = ["First Name", "Last Name", "Marksheet Image"]
    for row in reader:
        img_name = row[3]
        img = Image.open("D:\\Xampp\\htdocs\\php-api\\marksheet\\images\\" + img_name)
        processed_img = preprocess(img)

        mystring = pytesseract.image_to_string(
            processed_img,
            config="-l eng -c preserve_interword_spaces=1 output-preserve-enabled",
        )
        ans = postprocess(mystring)
        # selecting either cgpa or result
        for k in keywords:
            if k in ans and len(ans[k]) > 0:
                row.append(ans[k][0])
                header.append(k)

        header = camelcase(header, header)
        row.pop(0)
        for i in range(3):
            row.pop(0)
            header.pop(0)
        column_writer.writerow(header)
        writer.writerow(row)
        print("success")


main()
