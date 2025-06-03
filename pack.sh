#!/bin/bash

mkdir tgz
for pkg in stk appframe omnitable; do
  cd packages/$pkg
  pnpm pack --pack-destination ../../tgz
  cd -
done