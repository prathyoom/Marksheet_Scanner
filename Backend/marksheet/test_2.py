from PIL import Image
import pytesseract
import csv
import cv2
import numpy as np
from scipy import ndimage as nd
import difflib

def preprocess(img):

    img.thumbnail((1700,1700))

    # skew correction
    wd, ht = img.size
    pix = np.array(img.convert('1').getdata(), np.uint8)
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

    # denoising
    img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

    # grayscale conversion
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # scaling image
    img = cv2.resize(img, None, fx=3.5, fy=3.5, interpolation=cv2.INTER_LINEAR)

    # Otsu binarisation
    blur = cv2.GaussianBlur(img, (5, 5), 0)
    ret3, img = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
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
    crop = processed_img[y:y + h, x:x + w]
    return crop

def extractinfo(wrds, i):
    p = []
    flag = 0
    while i < len(wrds):
        if (wrds[i] == '' or wrds[i] == ':' or wrds[i] == '-' or wrds[i] == '='):
            if flag == 1:
                break
        else:
            p.append(wrds[i])
            p.append(' ')
            flag = 1
        i += 1
    s = ''.join(p)
    return s

keywords = ['board','name','roll','birth','school','(cgpa)','result']

def postprocess(mystring):
    lines = mystring.split('\n')

    # dictionary for relevant lines
    l={}

    # dictionary for final result
    ans = {}

    for k in keywords:
        l.setdefault(k,[])
        ans.setdefault(k,[])

    # extracting relevant lines from tesseract output
    for line in lines:
        if(len(line)>0):
            words = line.split(' ')
            for w in words:
                w = w.lower()
                result = difflib.get_close_matches(w,keywords,1,0.85)
                if(len(result)>0):
                    key = result[0]
                    l[result[0]].append(line)

    # extracting relevant information from the dictionary l
    for k in keywords:
        prev=''
        for str in l[k]:
            if(prev == ''):
                prev = l[k]
            elif(prev == str):
                continue
            else:
                prev = str
            if (k == 'board'):
                wrds = str.split('  ')
                for wrd in wrds:
                    subwrds = wrd.lower().split(' ')
                    result = difflib.get_close_matches('board', subwrds, 1, 0.85)
                    if(len(result)>0):
                        ans[k].append(wrd)

            if(k == 'name'):
                orgwrds = str.lower().split(' ')
                wrds = str.replace('/',' ').lower().split(' ')
                result = difflib.get_close_matches("father's", wrds, 1, 0.75)
                if(len(result)<=0):
                    result = difflib.get_close_matches("mother's", wrds, 1, 0.75)
                if (len(result) <= 0):
                    result = difflib.get_close_matches("guardian's", wrds, 1, 0.75)
                if(len(result)>0):
                    pos = difflib.get_close_matches("name", orgwrds, 1, 0.75)
                    i = orgwrds.index(pos[0])+1
                    ans[k].append(extractinfo(str.split(' '),i))

            if (k == 'roll' or k == 'birth' or k == '(cgpa)' or k=='result'):
                if(k == 'roll' ):
                    key = 'no.'
                else:
                    key = k
                wrds = str.lower().split(' ')
                result = difflib.get_close_matches(key, wrds, 1, 0.75)
                if (len(result) > 0):
                    i = wrds.index(result[0])+1
                    ans[k].append(extractinfo(str.split(' '),i))

            if(k == 'school'):
                wrds = str.lower().split(' ')
                result = difflib.get_close_matches('school', wrds, 1, 0.75)
                if (len(result) > 0):
                    i = wrds.index(result[0])+1
                if( (i < len(wrds)) and (wrds[i] == '' or wrds[i] == ':' or wrds[i]=='-' or wrds[i] == 'name')):
                    i=i+1
                    ans[k].append(extractinfo(str.split(' '),i))
    return ans

def main():

    # setting path for pytesseract
    pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract'

    print("parsing....")
    f = open("D:\\Xampp\\htdocs\\php-api\\marksheet\\input.csv", "r")
    reader = csv.reader(f)
    o = open("D:\\Xampp\\htdocs\\php-api\\marksheet\\outputs.csv", "w", newline="")
    writer = csv.writer(o)
    next(reader)
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
            if( k in ans and len(ans[k])>0):
                ans[k]=ans[k][0]
            if (k == '(cgpa)' and len(ans[k]) > 0):
                del ans['result']
            elif (k == '(cgpa)' and 'result' in ans and len(ans['result'])>0):
                ans['(cgpa)'] = ans['result'][0]
                del ans['result']
            elif(k == '(cgpa)'):
                del ans['result']

        for val in ans.values():
            row.append(val)
        row.pop(0)
        writer.writerow(row)
        print('success')
main()