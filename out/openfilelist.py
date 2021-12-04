from glob2 import glob
import sys
import os
import json

listfile = "D:/common/filelist.py"

if __name__ == '__main__':
    workdir = sys.argv[1]
    if workdir[0] == '/': workdir = workdir[1:]
    try:
        with open(listfile, 'r', encoding='utf-8') as f:
            text = f.read()
    except:
        sys.exit(-1)

    files = []
    for line in text.split('\n'):
        if len(line) < 1 or line[0] == '#': continue
        files += glob(os.path.join(workdir, '**', line))
    print(json.dumps(files))
    with open(os.path.join(workdir, 'tmp.json'),'w', encoding='utf-8') as f:
        json.dump(files, f, indent=4)
    