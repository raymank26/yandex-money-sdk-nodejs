#!/usr/bin/python
import os

if "yandex-money" in os.environ['TRAVIS_REPO_SLUG']:
    encrypted_filename = "constants.js.enc.yamoney"
else:
    encrypted_filename = "constants.js.enc"

os.system("openssl aes-256-cbc -K $encrypted_bd8aa6273b70_key -iv"
          "$encrypted_bd8aa6273b70_iv -in {}"
          "-out test/constants.js -d".format(encrypted_filename)
          )
