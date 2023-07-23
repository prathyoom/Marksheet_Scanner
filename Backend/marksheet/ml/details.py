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

    # Change DIR here
    img.save("D:\Xampp\htdocs\php-api\marksheet\images\corrected.jpg")
    # Change DIR here
    img = cv2.imread("D:\Xampp\htdocs\php-api\marksheet\images\corrected.jpg")

    # grayscale conversion
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # denoising
    img = cv2.fastNlMeansDenoising(img, None, 5, 7, 21)

    # scaling image
    img = cv2.resize(img, None, fx=3.5, fy=3.5, interpolation=cv2.INTER_NEAREST)

    # Otsu binarisation
    blur = cv2.GaussianBlur(img, (3, 3), 0)
    ret3, img = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    processed_img = img

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


keywords = ["board", "name", "roll", "birth", "school", "(cgpa)", "result"]


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
            for i in range(len(words)):
                words[i] = words[i].lower()
                result = difflib.get_close_matches(words[i], keywords, 1, 0.75)
                if len(result) > 0:
                    key = result[0]
                    l[key].append(" ".join(words))

    # extracting relevant information from the dictionary l
    for k in keywords:
        for str in l[k]:
            if k == "board":
                wrds = str.lower().split(" ")
                result = difflib.get_close_matches("board", wrds, 1, 0.75)
                i = 0

                while i < len(wrds) and next(
                    (chr for chr in wrds[i] if not chr.isalpha()), None
                ):
                    i += 1

                if len(result) > 0:
                    ans[k].append(extractinfo(str.split(" "), i))

            if k == "name":
                orgwrds = str.lower().split(" ")
                wrds = str.replace("/", " ").lower().split(" ")
                result = difflib.get_close_matches("father's", wrds, 1, 0.75)
                if len(result) <= 0:
                    result = difflib.get_close_matches("mother's", wrds, 1, 0.75)
                if len(result) <= 0:
                    result = difflib.get_close_matches("guardian's", wrds, 1, 0.75)
                if len(result) > 0:
                    pos = difflib.get_close_matches("name", orgwrds, 1, 0.75)
                    i = orgwrds.index(pos[0]) + 1
                    ans[k].append(extractinfo(str.split(" "), i))

            if k == "roll" or k == "birth" or k == "(cgpa)" or k == "result":
                if k == "roll":
                    key = "no."
                else:
                    key = k
                wrds = str.lower().split(" ")
                result = difflib.get_close_matches(key, wrds, 1, 0.75)
                if len(result) > 0:
                    i = wrds.index(result[0]) + 1
                    if k == "roll":
                        ans[k].append(extractnum(str.split(" "), i))
                    else:
                        ans[k].append(extractinfo(str.split(" "), i))

            if k == "school":
                wrds = str.lower().split(" ")
                result = difflib.get_close_matches("school", wrds, 1, 0.75)

                i = wrds.index(result[0]) + 1

                while i < len(wrds) and next(
                    (chr for chr in wrds[i] if chr.isdigit()), None
                ):
                    i += 1
                if wrds[0] == "secondary" or len(result) == 0:
                    continue

                ans[k].append(extractinfo(str.split(" "), i))

    return ans


def main():
    # setting path for pytesseract
    pytesseract.pytesseract.tesseract_cmd = (
        "C:\\Program Files\\Tesseract-OCR\\tesseract"
    )

    print("parsing....")
    # Change DIR here
    f = open("D:\\Xampp\\htdocs\\php-api\\marksheet\\input.csv", "r")
    reader = csv.reader(f)
    # Change DIR here
    o = open(
        "D:\\Xampp\\htdocs\\php-api\\marksheet\\output_details.csv", "w", newline=""
    )
    writer = csv.writer(o)
    next(reader)
    for row in reader:
        img_name = row[3]

        # Change DIR here
        img = Image.open("D:\\Xampp\\htdocs\\php-api\\marksheet\\images\\" + img_name)
        processed_img = preprocess(img)

        mystring = pytesseract.image_to_string(
            processed_img,
            config="-l eng -c preserve_interword_spaces=1 output-preserve-enabled",
        )
        ans = postprocess(mystring)
        # getting details
        for k in keywords:
            if k in ans and len(ans[k]) > 0:
                ans[k] = ans[k][0]
            if k == "(cgpa)" and len(ans[k]) > 0:
                del ans["result"]
            elif k == "(cgpa)" and "result" in ans and len(ans["result"]) > 0:
                ans["(cgpa)"] = ans["result"][0]
                del ans["result"]
            elif k == "(cgpa)":
                ans[k] = ""
                del ans["result"]
            elif k != "result":
                ans[k] = ""

        for val in ans.values():
            row.append(val)
        row.pop(0)
        writer.writerow(row)
        print("success")


main()
