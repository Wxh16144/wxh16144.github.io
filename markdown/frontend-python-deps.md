---
title: 前端一些包总是需要依赖python
date: 2024-05-06 14:34:04
tags: ["Node", "Npm"]
---


如题，安装 npm 包时，经常需要宿主环境存在 python 经常遇到问题，罪魁祸首就是 `node-gyp` 

写一个笔记记录一下平时解决的解决方案...

<!-- more -->

### canvas

_错误日志:_

<details>
  <summary>Click to expand</summary>
  
```
npm WARN deprecated is-data-descriptor@1.0.0: Please upgrade to v1.0.1
npm WARN deprecated is-accessor-descriptor@1.0.0: Please upgrade to v1.0.1
npm WARN deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility
npm WARN deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated source-map-resolve@0.5.3: See https://github.com/lydell/source-map-resolve#deprecated
npm WARN deprecated domexception@4.0.0: Use your platform's native DOMException instead
npm WARN deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
npm WARN deprecated workbox-cacheable-response@6.6.0: workbox-background-sync@6.6.0
npm WARN deprecated workbox-google-analytics@6.6.0: It is not compatible with newer versions of GA starting with v4, as long as you are using GAv3 it should be ok, but the package is not longer being maintained
npm ERR! code 1
npm ERR! path /Users/wuxh/Code/oss/yft-design/node_modules/canvas
npm ERR! command failed
npm ERR! command sh -c node-pre-gyp install --fallback-to-build --update-binary
npm ERR! Failed to execute '/Users/wuxh/.nvm/versions/node/v18.19.1/bin/node /Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js configure --fallback-to-build --update-binary --module=/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/Release/canvas.node --module_name=canvas --module_path=/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/Release --napi_version=9 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v108' (1)
npm ERR! node-pre-gyp info it worked if it ends with ok
npm ERR! node-pre-gyp info using node-pre-gyp@1.0.11
npm ERR! node-pre-gyp info using node@18.19.1 | darwin | arm64
npm ERR! node-pre-gyp http GET https://registry.npmmirror.com/-/binary/canvas/v2.11.2/canvas-v2.11.2-node-v108-darwin-unknown-arm64.tar.gz
npm ERR! node-pre-gyp ERR! install response status 404 Not Found on https://registry.npmmirror.com/-/binary/canvas/v2.11.2/canvas-v2.11.2-node-v108-darwin-unknown-arm64.tar.gz
npm ERR! node-pre-gyp WARN Pre-built binaries not installable for canvas@2.11.2 and node@18.19.1 (node-v108 ABI, unknown) (falling back to source compile with node-gyp)
npm ERR! node-pre-gyp WARN Hit error response status 404 Not Found on https://registry.npmmirror.com/-/binary/canvas/v2.11.2/canvas-v2.11.2-node-v108-darwin-unknown-arm64.tar.gz
npm ERR! gyp info it worked if it ends with ok
npm ERR! gyp info using node-gyp@10.0.1
npm ERR! gyp info using node@18.19.1 | darwin | arm64
npm ERR! gyp info ok
npm ERR! gyp info it worked if it ends with ok
npm ERR! gyp info using node-gyp@10.0.1
npm ERR! gyp info using node@18.19.1 | darwin | arm64
npm ERR! gyp info find Python using Python version 3.9.6 found at "/Library/Developer/CommandLineTools/usr/bin/python3"
npm ERR! gyp info spawn /Library/Developer/CommandLineTools/usr/bin/python3
npm ERR! gyp info spawn args [
npm ERR! gyp info spawn args '/Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp/gyp/gyp_main.py',
npm ERR! gyp info spawn args 'binding.gyp',
npm ERR! gyp info spawn args '-f',
npm ERR! gyp info spawn args 'make',
npm ERR! gyp info spawn args '-I',
npm ERR! gyp info spawn args '/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/config.gypi',
npm ERR! gyp info spawn args '-I',
npm ERR! gyp info spawn args '/Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp/addon.gypi',
npm ERR! gyp info spawn args '-I',
npm ERR! gyp info spawn args '/Users/wuxh/Library/Caches/node-gyp/18.19.1/include/node/common.gypi',
npm ERR! gyp info spawn args '-Dlibrary=shared_library',
npm ERR! gyp info spawn args '-Dvisibility=default',
npm ERR! gyp info spawn args '-Dnode_root_dir=/Users/wuxh/Library/Caches/node-gyp/18.19.1',
npm ERR! gyp info spawn args '-Dnode_gyp_dir=/Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp',
npm ERR! gyp info spawn args '-Dnode_lib_file=/Users/wuxh/Library/Caches/node-gyp/18.19.1/<(target_arch)/node.lib',
npm ERR! gyp info spawn args '-Dmodule_root_dir=/Users/wuxh/Code/oss/yft-design/node_modules/canvas',
npm ERR! gyp info spawn args '-Dnode_engine=v8',
npm ERR! gyp info spawn args '--depth=.',
npm ERR! gyp info spawn args '--no-parallel',
npm ERR! gyp info spawn args '--generator-output',
npm ERR! gyp info spawn args 'build',
npm ERR! gyp info spawn args '-Goutput_dir=.'
npm ERR! gyp info spawn args ]
npm ERR! /bin/sh: pkg-config: command not found
npm ERR! gyp: Call to 'pkg-config pixman-1 --libs' returned exit status 127 while in binding.gyp. while trying to load binding.gyp
npm ERR! gyp ERR! configure error
npm ERR! gyp ERR! stack Error: `gyp` failed with exit code: 1
npm ERR! gyp ERR! stack at ChildProcess.<anonymous> (/Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:271:18)
npm ERR! gyp ERR! stack at ChildProcess.emit (node:events:517:28)
npm ERR! gyp ERR! stack at ChildProcess._handle.onexit (node:internal/child_process:292:12)
npm ERR! gyp ERR! System Darwin 23.3.0
npm ERR! gyp ERR! command "/Users/wuxh/.nvm/versions/node/v18.19.1/bin/node" "/Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "configure" "--fallback-to-build" "--update-binary" "--module=/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/Release/canvas.node" "--module_name=canvas" "--module_path=/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/Release" "--napi_version=9" "--node_abi_napi=napi" "--napi_build_version=0" "--node_napi_label=node-v108"
npm ERR! gyp ERR! cwd /Users/wuxh/Code/oss/yft-design/node_modules/canvas
npm ERR! gyp ERR! node -v v18.19.1
npm ERR! gyp ERR! node-gyp -v v10.0.1
npm ERR! gyp ERR! not ok
npm ERR! node-pre-gyp ERR! build error
npm ERR! node-pre-gyp ERR! stack Error: Failed to execute '/Users/wuxh/.nvm/versions/node/v18.19.1/bin/node /Users/wuxh/.nvm/versions/node/v18.19.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js configure --fallback-to-build --update-binary --module=/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/Release/canvas.node --module_name=canvas --module_path=/Users/wuxh/Code/oss/yft-design/node_modules/canvas/build/Release --napi_version=9 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v108' (1)
npm ERR! node-pre-gyp ERR! stack     at ChildProcess.<anonymous> (/Users/wuxh/Code/oss/yft-design/node_modules/@mapbox/node-pre-gyp/lib/util/compile.js:89:23)
npm ERR! node-pre-gyp ERR! stack     at ChildProcess.emit (node:events:517:28)
npm ERR! node-pre-gyp ERR! stack     at maybeClose (node:internal/child_process:1098:16)
npm ERR! node-pre-gyp ERR! stack     at ChildProcess._handle.onexit (node:internal/child_process:303:5)
npm ERR! node-pre-gyp ERR! System Darwin 23.3.0
npm ERR! node-pre-gyp ERR! command "/Users/wuxh/.nvm/versions/node/v18.19.1/bin/node" "/Users/wuxh/Code/oss/yft-design/node_modules/.bin/node-pre-gyp" "install" "--fallback-to-build" "--update-binary"
npm ERR! node-pre-gyp ERR! cwd /Users/wuxh/Code/oss/yft-design/node_modules/canvas
npm ERR! node-pre-gyp ERR! node -v v18.19.1
npm ERR! node-pre-gyp ERR! node-pre-gyp -v v1.0.11
npm ERR! node-pre-gyp ERR! not ok

npm ERR! A complete log of this run can be found in: /Users/wuxh/.npm/_logs/2024-04-02T14_38_31_913Z-debug-0.log
``` 
  
</details>

解决方案: [Can't install on Apple M1](https://github.com/Automattic/node-canvas/issues/1733#issuecomment-808916786)、[node-canvas#Compiling](https://github.com/Automattic/node-canvas?tab=readme-ov-file#compiling)

### node-sass

源文加速： 

```
export SASS_BINARY_SITE="https://cdn.npmmirror.com/binaries/node-sass"
```

### tree-sitter-yaml

_错误日志:_

<details>
  <summary>Click to expand</summary>
  
  ```
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /Users/wuxh/Library/pnpm/store/v3
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 2399, reused 2399, downloaded 0, added 2405, done
node_modules/.pnpm/tree-sitter-json@0.20.2/node_modules/tree-sitter-json: Running install script...
node_modules/.pnpm/tree-sitter-yaml@0.5.0/node_modules/tree-sitter-yaml: Running install script, failed in 602ms
.../node_modules/tree-sitter-yaml install$ node-gyp rebuild
│ gyp info it worked if it ends with ok
│ gyp info using node-gyp@9.3.1
│ gyp info using node@18.20.2 | darwin | arm64
node_modules/.pnpm/tree-sitter-json@0.20.2/node_modules/tree-sitter-json: Running install script, failed in 1.7s
.../node_modules/tree-sitter-json install$ node-gyp rebuild
│ gyp info it worked if it ends with ok
│ gyp info using node-gyp@9.3.1
│ gyp info using node@18.20.2 | darwin | arm64
│ gyp info find Python using Python version 3.12.2 found at "/opt/homebrew/opt/python@3.12/bin/python3.12"
│ gyp info spawn /opt/homebrew/opt/python@3.12/bin/python3.12
│ gyp info spawn args [
│ gyp info spawn args   '/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py',yaml/build/config
│ gyp info spawn args   'binding.gyp',
│ gyp info spawn args   '-f',
│ gyp info spawn args   'make',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-json@0.20.2/node_modules/tree-sitter-json/build/confi
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/addon.gypi',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/Library/Caches/node-gyp/18.20.2/include/node/common.gypi',rch)/node.lib',
│ gyp info spawn args   '-Dlibrary=shared_library',
│ gyp info spawn args   '-Dvisibility=default',
│ gyp info spawn args   '-Dnode_root_dir=/Users/wuxh/Library/Caches/node-gyp/18.20.2',
│ gyp info spawn args   '-Dnode_gyp_dir=/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp',
│ gyp info spawn args   '-Dnode_lib_file=/Users/wuxh/Library/Caches/node-gyp/18.20.2/<(target_arch)/node.lib',
│ gyp info spawn args   '-Dmodule_root_dir=/Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-json@0.20.2/node_modules/tree-sitte
│ gyp info spawn args   '-Dnode_engine=v8',
│ gyp info spawn args   '--depth=.',
│ gyp info spawn args   '--no-parallel',
│ gyp info spawn args   '--generator-output',20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py", line 42, in <module>
│ gyp info spawn args   'build',
│ gyp info spawn args   '-Goutput_dir=.'
│ gyp info spawn args ]
│ Traceback (most recent call last):
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py", line 42, in <module>module>
│     import gyp  # noqa: E402
│     ^^^^^^^^^^
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/pylib/gyp/__init__.py", line 9, in <module>
│     import gyp.input
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/pylib/gyp/input.py", line 19, in <module>igur
│     from distutils.version import StrictVersion
│ ModuleNotFoundError: No module named 'distutils't (node:internal/child_process:292:12)
│ gyp ERR! configure error
│ gyp ERR! stack Error: `gyp` failed with exit code: 1.20.2/bin/node" "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modul
│ gyp ERR! stack     at ChildProcess.onCpExit (/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/lib/configur
│ gyp ERR! stack     at ChildProcess.emit (node:events:517:28)
│ gyp ERR! stack     at ChildProcess._handle.onexit (node:internal/child_process:292:12)
│ gyp ERR! System Darwin 23.3.0
│ gyp ERR! command "/Users/wuxh/.nvm/versions/node/v18.20.2/bin/node" "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modul
│ gyp ERR! cwd /Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-json@0.20.2/node_modules/tree-sitter-json
│ gyp ERR! node -v v18.20.2
│ gyp ERR! node-gyp -v v9.3.1
│ gyp ERR! not ok
└─ Failed in 1.7s at /Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-json@0.20.2/node_modules/tree-sitter-json
node_modules/.pnpm/tree-sitter-yaml@0.5.0/node_modules/tree-sitter-yaml: Running install script, failed in 602ms
.../node_modules/tree-sitter-yaml install$ node-gyp rebuild
│ gyp info it worked if it ends with ok
│ gyp info using node-gyp@9.3.1
│ gyp info using node@18.20.2 | darwin | arm64
│ gyp info find Python using Python version 3.12.2 found at "/opt/homebrew/opt/python@3.12/bin/python3.12"
│ gyp info spawn /opt/homebrew/opt/python@3.12/bin/python3.12
│ gyp info spawn args [
│ gyp info spawn args   '/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py',
│ gyp info spawn args   'binding.gyp',
│ gyp info spawn args   '-f',
│ gyp info spawn args   'make',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-yaml@0.5.0/node_modules/tree-sitter-yaml/build/config
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/addon.gypi',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/Library/Caches/node-gyp/18.20.2/include/node/common.gypi',
│ gyp info spawn args   '-Dlibrary=shared_library',
│ gyp info spawn args   '-Dvisibility=default',
│ gyp info spawn args   '-Dnode_root_dir=/Users/wuxh/Library/Caches/node-gyp/18.20.2',
│ gyp info spawn args   '-Dnode_gyp_dir=/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp',
│ gyp info spawn args   '-Dnode_lib_file=/Users/wuxh/Library/Caches/node-gyp/18.20.2/<(target_arch)/node.lib',
│ gyp info spawn args   '-Dmodule_root_dir=/Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-yaml@0.5.0/node_modules/tree-sitter
│ gyp info spawn args   '-Dnode_engine=v8',
│ gyp info spawn args   '--depth=.',
│ gyp info spawn args   '--no-parallel',
│ gyp info spawn args   '--generator-output',
│ gyp info spawn args   'build',
│ gyp info spawn args   '-Goutput_dir=.'
│ gyp info spawn args ]
│ Traceback (most recent call last):
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py", line 42, in <module>
│     import gyp  # noqa: E402
│     ^^^^^^^^^^
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/pylib/gyp/__init__.py", line 9, in <module>
│     import gyp.input
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/pylib/gyp/input.py", line 19, in <module>
│     from distutils.version import StrictVersion
│ ModuleNotFoundError: No module named 'distutils'
│ gyp ERR! configure error
│ gyp ERR! stack Error: `gyp` failed with exit code: 1
│ gyp ERR! stack     at ChildProcess.onCpExit (/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/lib/configur
│ gyp ERR! stack     at ChildProcess.emit (node:events:517:28)
│ gyp ERR! stack     at ChildProcess._handle.onexit (node:internal/child_process:292:12)
│ gyp ERR! System Darwin 23.3.0
│ gyp ERR! command "/Users/wuxh/.nvm/versions/node/v18.20.2/bin/node" "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modul
│ gyp ERR! cwd /Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-yaml@0.5.0/node_modules/tree-sitter-yaml
│ gyp ERR! node -v v18.20.2
│ gyp ERR! node-gyp -v v9.3.1
│ gyp ERR! not ok
└─ Failed in 602ms at /Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter-yaml@0.5.0/node_modules/tree-sitter-yaml
node_modules/.pnpm/tree-sitter@0.20.4/node_modules/tree-sitter: Running install script, failed in 4.4s
.../node_modules/tree-sitter install$ prebuild-install || node-gyp rebuild
│ prebuild-install warn install No prebuilt binaries found (target=18.20.2 runtime=node arch=arm64 libc= platform=darwin)
│ gyp info it worked if it ends with ok
│ gyp info using node-gyp@9.3.1
│ gyp info using node@18.20.2 | darwin | arm64
│ gyp info find Python using Python version 3.12.2 found at "/opt/homebrew/opt/python@3.12/bin/python3.12"
│ gyp info spawn /opt/homebrew/opt/python@3.12/bin/python3.12
│ gyp info spawn args [
│ gyp info spawn args   '/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py',
│ gyp info spawn args   'binding.gyp',
│ gyp info spawn args   '-f',
│ gyp info spawn args   'make',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter@0.20.4/node_modules/tree-sitter/build/config.gypi',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/addon.gypi',
│ gyp info spawn args   '-I',
│ gyp info spawn args   '/Users/wuxh/Library/Caches/node-gyp/18.20.2/include/node/common.gypi',
│ gyp info spawn args   '-Dlibrary=shared_library',
│ gyp info spawn args   '-Dvisibility=default',
│ gyp info spawn args   '-Dnode_root_dir=/Users/wuxh/Library/Caches/node-gyp/18.20.2',
│ gyp info spawn args   '-Dnode_gyp_dir=/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp',
│ gyp info spawn args   '-Dnode_lib_file=/Users/wuxh/Library/Caches/node-gyp/18.20.2/<(target_arch)/node.lib',
│ gyp info spawn args   '-Dmodule_root_dir=/Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter@0.20.4/node_modules/tree-sitter',
│ gyp info spawn args   '-Dnode_engine=v8',
│ gyp info spawn args   '--depth=.',
│ gyp info spawn args   '--no-parallel',
│ gyp info spawn args   '--generator-output',
│ gyp info spawn args   'build',
│ gyp info spawn args   '-Goutput_dir=.'
│ gyp info spawn args ]
│ Traceback (most recent call last):
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/gyp_main.py", line 42, in <module>
│     import gyp  # noqa: E402
│     ^^^^^^^^^^
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/pylib/gyp/__init__.py", line 9, in <module>
│     import gyp.input
│   File "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/gyp/pylib/gyp/input.py", line 19, in <module>
│     from distutils.version import StrictVersion
│ ModuleNotFoundError: No module named 'distutils'
│ gyp ERR! configure error
│ gyp ERR! stack Error: `gyp` failed with exit code: 1
│ gyp ERR! stack     at ChildProcess.onCpExit (/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modules/node-gyp/lib/configur
│ gyp ERR! stack     at ChildProcess.emit (node:events:517:28)
│ gyp ERR! stack     at ChildProcess._handle.onexit (node:internal/child_process:292:12)
│ gyp ERR! System Darwin 23.3.0
│ gyp ERR! command "/Users/wuxh/.nvm/versions/node/v18.20.2/bin/node" "/Users/wuxh/.nvm/versions/node/v18.20.2/lib/node_modules/pnpm/dist/node_modul
│ gyp ERR! cwd /Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter@0.20.4/node_modules/tree-sitter
│ gyp ERR! node -v v18.20.2
│ gyp ERR! node-gyp -v v9.3.1
│ gyp ERR! not ok
└─ Failed in 4.4s at /Users/wuxh/Code/oss/lobehub/lobe-chat/node_modules/.pnpm/tree-sitter@0.20.4/node_modules/tree-sitter
 ELIFECYCLE  Command failed with exit code 1.
  ```

</details>

解决方案：https://stackoverflow.com/a/76691103/13086128