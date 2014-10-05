#!/usr/bin/python
import os

if "yandex-money" in os.environ['TRAVIS_REPO_SLUG']:
    encrypted_filename = "constants.js.enc.yamoney"
else:
    encrypted_filename = "constants.js.enc"

os.system("openssl aes-256-cbc -K {} -iv"
          " {} -in {}"
          "-out test/constants.js -d".format(
              os.environ['encrypted_bd8aa6273b70_key'],
              os.environ['encrypted_bd8aa6273b70_iv'],
              encrypted_filename)
          )
