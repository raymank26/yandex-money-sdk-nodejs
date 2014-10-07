#!/usr/bin/python
import os
import sys

if "raymank26/" in os.environ['TRAVIS_REPO_SLUG']:
    encrypted_filename = "constants.js.enc"
else:
    encrypted_filename = "constants.js.enc.yamoney"

print("file to decrypt = {}".format(encrypted_filename))

command = "openssl aes-256-cbc -K {} -iv {} -in {} -out test/constants.js -d".format(
              os.environ.get('encrypted_bd8aa6273b70_key'),
              os.environ.get('encrypted_bd8aa6273b70_iv'),
              encrypted_filename)

if(len(sys.argv) > 1 and sys.argv[1] == "debug"):
    print(command)
else:
    os.system(command)


