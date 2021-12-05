import sys
import os

text = '''#ifdef __cplusplus\nextern "C" {\n#endif\n\n#ifdef __cplusplus\n}\n#endif\n'''

if __name__ == '__main__':
    file = sys.argv[1]
    name = os.path.split(file)[-1].split('.')[0]
    with open(file, 'a', encoding='utf-8') as f:
        if file[-2:] == '.c':
            f.write('\n#include "{}.h"\n\n'.format(name))
            f.write(text)
        elif file[-2:] == '.h': 
            f.write('\n#ifndef {0}_H\n#define {0}_H\n\n'.format(name.upper()))
            f.write(text)
            f.write('#endif\n')

