// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.6.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图、B 键收藏和 U 键取消收藏
// @license      MIT
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      i.pximg.net
// ==/UserScript==

// Third-Party Licenses
//
// This project bundles @zip.js/zip.js.
//
// BSD 3-Clause License
//
// Copyright (c) 2023, Gildas Lormeau
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its
//    contributors may be used to endorse or promote products derived from
//    this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // ../../node_modules/@zip.js/zip.js/lib/core/constants.js
  var MAX_32_BITS, MAX_16_BITS, MAX_8_BITS, COMPRESSION_METHOD_DEFLATE, COMPRESSION_METHOD_DEFLATE_64, COMPRESSION_METHOD_STORE, COMPRESSION_METHOD_AES, LOCAL_FILE_HEADER_SIGNATURE, SPLIT_ZIP_FILE_SIGNATURE, TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE, DATA_DESCRIPTOR_RECORD_SIGNATURE, ARCHIVE_EXTRA_DATA_SIGNATURE, DIGITAL_SIGNATURE_RECORD_SIGNATURE, CENTRAL_FILE_HEADER_SIGNATURE, END_OF_CENTRAL_DIR_SIGNATURE, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE, CENTRAL_FILE_HEADER_LENGTH, END_OF_CENTRAL_DIR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH, DATA_DESCRIPTOR_RECORD_LENGTH, DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH, DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, SPLIT_ZIP_FILE_SIGNATURE_LENGTH, EXTRAFIELD_TYPE_ZIP64, EXTRAFIELD_TYPE_AES, EXTRAFIELD_TYPE_NTFS, EXTRAFIELD_TYPE_NTFS_TAG1, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP, EXTRAFIELD_TYPE_UNICODE_PATH, EXTRAFIELD_TYPE_UNICODE_COMMENT, EXTRAFIELD_TYPE_USDZ, EXTRAFIELD_TYPE_INFOZIP, EXTRAFIELD_TYPE_UNIX, EXTRAFIELD_TYPE_UNIX_TYPE1, EXTRAFIELD_TYPE_PKWARE_UNIX, BITFLAG_ENCRYPTED, BITFLAG_LEVEL, BITFLAG_LEVEL_MAX_MASK, BITFLAG_LEVEL_FAST_MASK, BITFLAG_LEVEL_SUPER_FAST_MASK, BITFLAG_DATA_DESCRIPTOR, BITFLAG_COMPRESSED_PATCHED_DATA, BITFLAG_STRONG_ENCRYPTION, BITFLAG_LANG_ENCODING_FLAG, BITFLAG_MASKED_LOCAL_HEADERS, FILE_ATTR_MSDOS_DIR_MASK, FILE_ATTR_MSDOS_READONLY_MASK, FILE_ATTR_MSDOS_HIDDEN_MASK, FILE_ATTR_MSDOS_SYSTEM_MASK, FILE_ATTR_MSDOS_ARCHIVE_MASK, FILE_ATTR_UNIX_TYPE_MASK, FILE_ATTR_UNIX_TYPE_DIR, FILE_ATTR_UNIX_TYPE_SYMLINK, FILE_ATTR_UNIX_TYPE_FILE, FILE_ATTR_UNIX_EXECUTABLE_MASK, FILE_ATTR_UNIX_DEFAULT_MASK, FILE_ATTR_UNIX_SETUID_MASK, FILE_ATTR_UNIX_SETGID_MASK, FILE_ATTR_UNIX_STICKY_MASK, VERSION_STORE, VERSION_DEFLATE, VERSION_ZIP64, VERSION_AES, VERSION_MADE_BY_MSDOS, VERSION_MADE_BY_UNIX, DIRECTORY_SIGNATURE, HEADER_SIZE, HEADER_OFFSET_VERSION, HEADER_OFFSET_SIGNATURE, HEADER_OFFSET_COMPRESSED_SIZE, HEADER_OFFSET_UNCOMPRESSED_SIZE, HEADER_OFFSET_FILENAME_LENGTH, HEADER_OFFSET_EXTRAFIELD_LENGTH, LOCAL_HEADER_COMMON_OFFSET, MAX_DATE, MIN_DATE, UNDEFINED_VALUE, INFINITY_VALUE, UNDEFINED_TYPE, FUNCTION_TYPE, OBJECT_TYPE, STRING_TYPE, NUMBER_TYPE, BOOLEAN_TYPE, EMPTY_UINT8_ARRAY, SYMBOL_ASYNC_DISPOSE;
  var init_constants = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/constants.js"() {
      MAX_32_BITS = 4294967295;
      MAX_16_BITS = 65535;
      MAX_8_BITS = 255;
      COMPRESSION_METHOD_DEFLATE = 8;
      COMPRESSION_METHOD_DEFLATE_64 = 9;
      COMPRESSION_METHOD_STORE = 0;
      COMPRESSION_METHOD_AES = 99;
      LOCAL_FILE_HEADER_SIGNATURE = 67324752;
      SPLIT_ZIP_FILE_SIGNATURE = 134695760;
      TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE = 808471376;
      DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
      ARCHIVE_EXTRA_DATA_SIGNATURE = 134630224;
      DIGITAL_SIGNATURE_RECORD_SIGNATURE = 84233040;
      CENTRAL_FILE_HEADER_SIGNATURE = 33639248;
      END_OF_CENTRAL_DIR_SIGNATURE = 101010256;
      ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 101075792;
      ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 117853008;
      CENTRAL_FILE_HEADER_LENGTH = 46;
      END_OF_CENTRAL_DIR_LENGTH = 22;
      ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
      ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
      ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;
      DATA_DESCRIPTOR_RECORD_LENGTH = 12;
      DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH = 20;
      DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH = 4;
      SPLIT_ZIP_FILE_SIGNATURE_LENGTH = 4;
      EXTRAFIELD_TYPE_ZIP64 = 1;
      EXTRAFIELD_TYPE_AES = 39169;
      EXTRAFIELD_TYPE_NTFS = 10;
      EXTRAFIELD_TYPE_NTFS_TAG1 = 1;
      EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 21589;
      EXTRAFIELD_TYPE_UNICODE_PATH = 28789;
      EXTRAFIELD_TYPE_UNICODE_COMMENT = 25461;
      EXTRAFIELD_TYPE_USDZ = 6534;
      EXTRAFIELD_TYPE_INFOZIP = 30837;
      EXTRAFIELD_TYPE_UNIX = 30805;
      EXTRAFIELD_TYPE_UNIX_TYPE1 = 22613;
      EXTRAFIELD_TYPE_PKWARE_UNIX = 13;
      BITFLAG_ENCRYPTED = 1;
      BITFLAG_LEVEL = 6;
      BITFLAG_LEVEL_MAX_MASK = 2;
      BITFLAG_LEVEL_FAST_MASK = 4;
      BITFLAG_LEVEL_SUPER_FAST_MASK = 6;
      BITFLAG_DATA_DESCRIPTOR = 8;
      BITFLAG_COMPRESSED_PATCHED_DATA = 32;
      BITFLAG_STRONG_ENCRYPTION = 64;
      BITFLAG_LANG_ENCODING_FLAG = 2048;
      BITFLAG_MASKED_LOCAL_HEADERS = 8192;
      FILE_ATTR_MSDOS_DIR_MASK = 16;
      FILE_ATTR_MSDOS_READONLY_MASK = 1;
      FILE_ATTR_MSDOS_HIDDEN_MASK = 2;
      FILE_ATTR_MSDOS_SYSTEM_MASK = 4;
      FILE_ATTR_MSDOS_ARCHIVE_MASK = 32;
      FILE_ATTR_UNIX_TYPE_MASK = 61440;
      FILE_ATTR_UNIX_TYPE_DIR = 16384;
      FILE_ATTR_UNIX_TYPE_SYMLINK = 40960;
      FILE_ATTR_UNIX_TYPE_FILE = 32768;
      FILE_ATTR_UNIX_EXECUTABLE_MASK = 73;
      FILE_ATTR_UNIX_DEFAULT_MASK = 420;
      FILE_ATTR_UNIX_SETUID_MASK = 2048;
      FILE_ATTR_UNIX_SETGID_MASK = 1024;
      FILE_ATTR_UNIX_STICKY_MASK = 512;
      VERSION_STORE = 10;
      VERSION_DEFLATE = 20;
      VERSION_ZIP64 = 45;
      VERSION_AES = 51;
      VERSION_MADE_BY_MSDOS = 20;
      VERSION_MADE_BY_UNIX = 768;
      DIRECTORY_SIGNATURE = "/";
      HEADER_SIZE = 30;
      HEADER_OFFSET_VERSION = 0;
      HEADER_OFFSET_SIGNATURE = 10;
      HEADER_OFFSET_COMPRESSED_SIZE = 14;
      HEADER_OFFSET_UNCOMPRESSED_SIZE = 18;
      HEADER_OFFSET_FILENAME_LENGTH = 22;
      HEADER_OFFSET_EXTRAFIELD_LENGTH = 24;
      LOCAL_HEADER_COMMON_OFFSET = 4;
      MAX_DATE = new Date(2107, 11, 31, 23, 59, 58);
      MIN_DATE = new Date(1980, 0, 1);
      UNDEFINED_VALUE = void 0;
      INFINITY_VALUE = Infinity;
      UNDEFINED_TYPE = "undefined";
      FUNCTION_TYPE = "function";
      OBJECT_TYPE = "object";
      STRING_TYPE = "string";
      NUMBER_TYPE = "number";
      BOOLEAN_TYPE = "boolean";
      EMPTY_UINT8_ARRAY = new Uint8Array();
      SYMBOL_ASYNC_DISPOSE = Symbol.asyncDispose || Symbol();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/options.js
  function checkFunctionOption(value) {
    if (value && typeof value != FUNCTION_TYPE) {
      throw new Error(ERR_INVALID_FUNCTION_OPTION);
    }
    return value;
  }
  function checkSignalOption(signal) {
    if (signal && (typeof signal.addEventListener != FUNCTION_TYPE || typeof signal.aborted != BOOLEAN_TYPE)) {
      throw new Error(ERR_INVALID_SIGNAL);
    }
    return signal || UNDEFINED_VALUE;
  }
  function throwIfAborted(signal) {
    if (signal && signal.aborted) {
      throw signal.reason === UNDEFINED_VALUE ? new DOMException(ERR_ABORTED, ABORT_ERROR_NAME) : signal.reason;
    }
  }
  function checkPasswordOption(password, rawPassword) {
    if (password && typeof password != STRING_TYPE || rawPassword && !(rawPassword instanceof Uint8Array)) {
      throw new Error(ERR_INVALID_PASSWORD_TYPE);
    }
  }
  function checkPassThroughOption(passThrough) {
    if (passThrough !== UNDEFINED_VALUE && typeof passThrough != BOOLEAN_TYPE && passThrough !== PASS_THROUGH_COMPRESSED) {
      throw new Error(ERR_INVALID_PASS_THROUGH_VALUE);
    }
    return passThrough;
  }
  function checkInteger(value, maxValue, errorMessage) {
    if (!Number.isInteger(value) || value < 0 || value > maxValue) {
      throw new Error(errorMessage);
    }
  }
  function checkIntegerOption(value, maxValue, errorMessage) {
    if (value !== UNDEFINED_VALUE) {
      checkInteger(value, maxValue, errorMessage);
    }
  }
  function toNumber(value) {
    return typeof value == STRING_TYPE && value.trim() ? Number(value) : value;
  }
  var OPTION_FILENAME_ENCODING, OPTION_COMMENT_ENCODING, OPTION_DECODE_TEXT, OPTION_EXTRACT_PREPENDED_DATA, OPTION_EXTRACT_APPENDED_DATA, OPTION_PASSWORD, OPTION_RAW_PASSWORD, OPTION_PASS_THROUGH, OPTION_SIGNAL, OPTION_CHECK_PASSWORD_ONLY, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY, OPTION_CHECK_OVERLAPPING_ENTRY, OPTION_CHECK_AMBIGUITY, OPTION_CHECK_LOCAL_DIRECTORY, OPTION_CHECK_LOCAL_FILENAME, OPTION_CHECK_SIGNATURE, OPTION_CHECK_CRC32, OPTION_CHECK_AUTHENTICATION_CODE, OPTION_USE_WEB_WORKERS, OPTION_USE_COMPRESSION_STREAM, OPTION_TRANSFER_STREAMS, OPTION_PREVENT_CLOSE, OPTION_ENCRYPTION_STRENGTH, OPTION_EXTENDED_TIMESTAMP, OPTION_NTFS_TIMESTAMP, OPTION_KEEP_ORDER, OPTION_LEVEL, OPTION_BUFFERED_WRITE, OPTION_CREATE_TEMP_STREAM, OPTION_DATA_DESCRIPTOR_SIGNATURE, OPTION_USE_UNICODE_FILE_NAMES, OPTION_DATA_DESCRIPTOR, OPTION_SUPPORT_ZIP64_SPLIT_FILE, OPTION_ENCODE_TEXT, OPTION_OFFSET, OPTION_USDZ, OPTION_UNIX_EXTRA_FIELD_TYPE, OPTION_LOCAL_EXTRA_FIELD, OPTION_CENTRAL_EXTRA_FIELD, OPTION_STRICTNESS, OPTION_FILENAME_VALIDATION, OPTION_NORMALIZE_FILENAME, OPTION_MAX_APPENDED_DATA_SIZE, OPTION_DECRYPT_CENTRAL_DIRECTORY, OPTION_SIGN_CENTRAL_DIRECTORY, OPTION_ENTRY, TEXT_TYPE_FILENAME, TEXT_TYPE_COMMENT, STRICTNESS_STRICT, STRICTNESS_BALANCED, STRICTNESS_TOLERANT, PASS_THROUGH_COMPRESSED, ERR_INVALID_FUNCTION_OPTION, ERR_INVALID_SIGNAL, ERR_INVALID_PASSWORD_TYPE, ERR_INVALID_PASS_THROUGH_VALUE, ERR_ABORTED, ABORT_ERROR_NAME;
  var init_options = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/options.js"() {
      init_constants();
      OPTION_FILENAME_ENCODING = "filenameEncoding";
      OPTION_COMMENT_ENCODING = "commentEncoding";
      OPTION_DECODE_TEXT = "decodeText";
      OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
      OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
      OPTION_PASSWORD = "password";
      OPTION_RAW_PASSWORD = "rawPassword";
      OPTION_PASS_THROUGH = "passThrough";
      OPTION_SIGNAL = "signal";
      OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
      OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
      OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
      OPTION_CHECK_AMBIGUITY = "checkAmbiguity";
      OPTION_CHECK_LOCAL_DIRECTORY = "checkLocalDirectory";
      OPTION_CHECK_LOCAL_FILENAME = "checkLocalFilename";
      OPTION_CHECK_SIGNATURE = "checkSignature";
      OPTION_CHECK_CRC32 = "checkCrc32";
      OPTION_CHECK_AUTHENTICATION_CODE = "checkAuthenticationCode";
      OPTION_USE_WEB_WORKERS = "useWebWorkers";
      OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
      OPTION_TRANSFER_STREAMS = "transferStreams";
      OPTION_PREVENT_CLOSE = "preventClose";
      OPTION_ENCRYPTION_STRENGTH = "encryptionStrength";
      OPTION_EXTENDED_TIMESTAMP = "extendedTimestamp";
      OPTION_NTFS_TIMESTAMP = "ntfsTimestamp";
      OPTION_KEEP_ORDER = "keepOrder";
      OPTION_LEVEL = "level";
      OPTION_BUFFERED_WRITE = "bufferedWrite";
      OPTION_CREATE_TEMP_STREAM = "createTempStream";
      OPTION_DATA_DESCRIPTOR_SIGNATURE = "dataDescriptorSignature";
      OPTION_USE_UNICODE_FILE_NAMES = "useUnicodeFileNames";
      OPTION_DATA_DESCRIPTOR = "dataDescriptor";
      OPTION_SUPPORT_ZIP64_SPLIT_FILE = "supportZip64SplitFile";
      OPTION_ENCODE_TEXT = "encodeText";
      OPTION_OFFSET = "offset";
      OPTION_USDZ = "usdz";
      OPTION_UNIX_EXTRA_FIELD_TYPE = "unixExtraFieldType";
      OPTION_LOCAL_EXTRA_FIELD = "localExtraField";
      OPTION_CENTRAL_EXTRA_FIELD = "centralExtraField";
      OPTION_STRICTNESS = "strictness";
      OPTION_FILENAME_VALIDATION = "filenameValidation";
      OPTION_NORMALIZE_FILENAME = "normalizeFilename";
      OPTION_MAX_APPENDED_DATA_SIZE = "maxAppendedDataSize";
      OPTION_DECRYPT_CENTRAL_DIRECTORY = "decryptCentralDirectory";
      OPTION_SIGN_CENTRAL_DIRECTORY = "signCentralDirectory";
      OPTION_ENTRY = "entry";
      TEXT_TYPE_FILENAME = "filename";
      TEXT_TYPE_COMMENT = "comment";
      STRICTNESS_STRICT = "strict";
      STRICTNESS_BALANCED = "balanced";
      STRICTNESS_TOLERANT = "tolerant";
      PASS_THROUGH_COMPRESSED = "compressed";
      ERR_INVALID_FUNCTION_OPTION = "Invalid option (must be a function)";
      ERR_INVALID_SIGNAL = "Invalid signal (must be an AbortSignal instance)";
      ERR_INVALID_PASSWORD_TYPE = "Invalid password (password must be a string, rawPassword must be a Uint8Array)";
      ERR_INVALID_PASS_THROUGH_VALUE = "Invalid passThrough option (must be a boolean or 'compressed')";
      ERR_ABORTED = "The operation was aborted";
      ABORT_ERROR_NAME = "AbortError";
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/configuration.js
  function getConfiguration() {
    return config;
  }
  function getChunkSize(config2) {
    return normalizeChunkSize(config2.chunkSize);
  }
  function normalizeChunkSize(chunkSize) {
    chunkSize = toNumber(chunkSize);
    return Number.isInteger(chunkSize) && chunkSize >= MINIMUM_PROPERTY_VALUE ? Math.max(chunkSize, MINIMUM_CHUNK_SIZE) : DEFAULT_CHUNK_SIZE;
  }
  function checkConfiguration(configuration) {
    const checkedConfiguration = {};
    for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
      const propertyValue = configuration[propertyName];
      if (propertyValue !== UNDEFINED_VALUE) {
        checkedConfiguration[propertyName] = checkPropertyValue(propertyName, propertyValue);
      }
    }
    return checkedConfiguration;
  }
  function checkPropertyValue(propertyName, propertyValue) {
    if (NUMBER_PROPERTY_NAMES.includes(propertyName)) {
      propertyValue = toNumber(propertyValue);
      if (propertyName == PROPERTY_NAME_MAX_WORKERS && (!Number.isInteger(propertyValue) || propertyValue < MINIMUM_PROPERTY_VALUE)) {
        throw new Error(ERR_INVALID_MAX_WORKERS);
      }
    } else if (FUNCTION_PROPERTY_NAMES.includes(propertyName)) {
      checkFunctionOption(propertyValue);
    } else if (propertyName == PROPERTY_NAME_BASE_URI) {
      if (propertyValue && typeof propertyValue != STRING_TYPE) {
        throw new Error(ERR_INVALID_BASE_URI);
      }
    } else if (URI_PROPERTY_NAMES.includes(propertyName)) {
      if (propertyValue && typeof propertyValue != STRING_TYPE && typeof propertyValue != FUNCTION_TYPE) {
        throw new Error(ERR_INVALID_URI);
      }
    }
    return propertyValue;
  }
  function normalizeConfiguration(configuration) {
    configuration = configuration || {};
    const { CompressionStreamZlib, DecompressionStreamZlib } = configuration;
    if (CompressionStreamZlib === UNDEFINED_VALUE && DecompressionStreamZlib === UNDEFINED_VALUE) {
      return configuration;
    }
    const normalizedConfiguration = Object.assign({}, configuration);
    if (normalizedConfiguration.CompressionStreamFallback === UNDEFINED_VALUE) {
      normalizedConfiguration.CompressionStreamFallback = CompressionStreamZlib;
    }
    if (normalizedConfiguration.DecompressionStreamFallback === UNDEFINED_VALUE) {
      normalizedConfiguration.DecompressionStreamFallback = DecompressionStreamZlib;
    }
    return normalizedConfiguration;
  }
  function setDefaultConfiguration(configuration) {
    const checkedConfiguration = checkConfiguration(normalizeConfiguration(configuration));
    Object.assign(DEFAULT_CONFIGURATION, checkedConfiguration);
    Object.assign(config, checkedConfiguration);
  }
  var DEFAULT_CHUNK_SIZE, MINIMUM_CHUNK_SIZE, MINIMUM_PROPERTY_VALUE, ERR_INVALID_MAX_WORKERS, ERR_INVALID_BASE_URI, ERR_INVALID_URI, maxWorkers, DEFAULT_CONFIGURATION, PROPERTY_NAME_MAX_WORKERS, PROPERTY_NAME_BASE_URI, URI_PROPERTY_NAMES, BOOLEAN_PROPERTY_NAMES, NUMBER_PROPERTY_NAMES, FUNCTION_PROPERTY_NAMES, CONFIGURABLE_PROPERTY_NAMES, config;
  var init_configuration = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/configuration.js"() {
      init_constants();
      init_options();
      DEFAULT_CHUNK_SIZE = 64 * 1024;
      MINIMUM_CHUNK_SIZE = 64;
      MINIMUM_PROPERTY_VALUE = 1;
      ERR_INVALID_MAX_WORKERS = "Invalid maxWorkers (must be an integer greater than 0)";
      ERR_INVALID_BASE_URI = "Invalid baseURI (must be a string)";
      ERR_INVALID_URI = "Invalid URI (must be a string or a function returning a string)";
      maxWorkers = 2;
      try {
        if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
          maxWorkers = navigator.hardwareConcurrency;
        }
      } catch {
      }
      DEFAULT_CONFIGURATION = {
        workerURI: "./core/web-worker-wasm.js",
        wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
        chunkSize: DEFAULT_CHUNK_SIZE,
        maxWorkers,
        terminateWorkerTimeout: 5e3,
        workerStarvationTimeout: 5e3,
        workerStartupTimeout: 5e3,
        useWebWorkers: true,
        useCompressionStream: true,
        transferStreams: true,
        CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
        DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
      };
      PROPERTY_NAME_MAX_WORKERS = "maxWorkers";
      PROPERTY_NAME_BASE_URI = "baseURI";
      URI_PROPERTY_NAMES = [
        "wasmURI",
        "workerURI"
      ];
      BOOLEAN_PROPERTY_NAMES = [
        "useCompressionStream",
        "useWebWorkers",
        "transferStreams"
      ];
      NUMBER_PROPERTY_NAMES = [
        "chunkSize",
        PROPERTY_NAME_MAX_WORKERS,
        "terminateWorkerTimeout",
        "workerStarvationTimeout",
        "workerStartupTimeout"
      ];
      FUNCTION_PROPERTY_NAMES = [
        "createWorker",
        "CompressionStream",
        "DecompressionStream",
        "CompressionStreamFallback",
        "DecompressionStreamFallback"
      ];
      CONFIGURABLE_PROPERTY_NAMES = [
        PROPERTY_NAME_BASE_URI,
        ...URI_PROPERTY_NAMES,
        ...BOOLEAN_PROPERTY_NAMES,
        ...NUMBER_PROPERTY_NAMES,
        ...FUNCTION_PROPERTY_NAMES
      ];
      config = { ...DEFAULT_CONFIGURATION };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/array.js
  function concat(first, second) {
    const result = new Uint8Array(first.length + second.length);
    result.set(first);
    result.set(second, first.length);
    return result;
  }
  function toExactUint8Array(array) {
    return array.byteOffset || array.byteLength != array.buffer.byteLength ? new Uint8Array(array) : array;
  }
  function getDataView(array) {
    return new DataView(array.buffer, array.byteOffset, array.byteLength);
  }
  var init_array = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/array.js"() {
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/error.js
  function isErrorObject(error) {
    return Boolean(error) && typeof error == "object";
  }
  var init_error = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/error.js"() {
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/codecs/crc32.js
  var T, T0, T1, T2, T3, T4, T5, T6, T7, Crc32;
  var init_crc32 = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/codecs/crc32.js"() {
      T = [[], [], [], [], [], [], [], []];
      for (let n = 0; n < 256; n++) {
        let t = n;
        for (let j2 = 0; j2 < 8; j2++) {
          t = t & 1 ? t >>> 1 ^ 3988292384 : t >>> 1;
        }
        T[0][n] = t;
      }
      for (let n = 0; n < 256; n++) {
        for (let k2 = 1; k2 < 8; k2++) {
          const previous = T[k2 - 1][n];
          T[k2][n] = previous >>> 8 ^ T[0][previous & 255];
        }
      }
      [T0, T1, T2, T3, T4, T5, T6, T7] = T;
      Crc32 = class {
        constructor(crc) {
          this.crc = crc || -1;
        }
        append(data) {
          let crc = this.crc | 0;
          const length = data.length | 0;
          let offset = 0;
          if (length >= 8 && data.buffer) {
            const view = new DataView(data.buffer, data.byteOffset, length);
            const end = length - 8;
            for (; offset <= end; offset += 8) {
              const a = crc ^ view.getInt32(offset, true);
              const b = view.getInt32(offset + 4, true);
              crc = T7[a & 255] ^ T6[a >>> 8 & 255] ^ T5[a >>> 16 & 255] ^ T4[a >>> 24 & 255] ^ T3[b & 255] ^ T2[b >>> 8 & 255] ^ T1[b >>> 16 & 255] ^ T0[b >>> 24 & 255];
            }
          }
          for (; offset < length; offset++) {
            crc = crc >>> 8 ^ T0[(crc ^ data[offset]) & 255];
          }
          this.crc = crc;
        }
        get() {
          return ~this.crc;
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/crc32-stream.js
  var Crc32Stream;
  var init_crc32_stream = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/crc32-stream.js"() {
      init_crc32();
      Crc32Stream = class extends TransformStream {
        constructor() {
          let stream;
          const crc32 = new Crc32();
          super({
            transform(chunk, controller) {
              crc32.append(chunk);
              controller.enqueue(chunk);
            },
            flush() {
              const value = new Uint8Array(4);
              const dataView = new DataView(value.buffer);
              dataView.setUint32(0, crc32.get());
              stream.value = value;
            }
          });
          stream = this;
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/encode-text.js
  function encodeText(value) {
    if (typeof TextEncoder == UNDEFINED_TYPE) {
      value = unescape(encodeURIComponent(value));
      const result = new Uint8Array(value.length);
      for (let i = 0; i < result.length; i++) {
        result[i] = value.charCodeAt(i);
      }
      return result;
    } else {
      return new TextEncoder().encode(value);
    }
  }
  var init_encode_text = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/encode-text.js"() {
      init_constants();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/codecs/aes-hmac-sha1.js
  function createEngine(key, authenticationKey) {
    initTables();
    const roundKeys = new Int32Array(ROUND_KEYS_LENGTH);
    const rounds = expandKey(key, roundKeys);
    const keystream = new Int32Array(BLOCK_LENGTH / 4);
    const hmac = createHmac(authenticationKey);
    let counter0 = 0;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    return {
      process(data, decrypt2) {
        if (decrypt2) {
          hmac.update(data, 0, data.length);
        }
        encrypt2(data);
        if (!decrypt2) {
          hmac.update(data, 0, data.length);
        }
      },
      digest() {
        return hmac.digest();
      }
    };
    function encrypt2(data) {
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const length = data.length;
      let offset = 0;
      for (; offset + BLOCK_LENGTH <= length; offset += BLOCK_LENGTH) {
        nextKeystream();
        view.setInt32(offset, view.getInt32(offset) ^ keystream[0]);
        view.setInt32(offset + 4, view.getInt32(offset + 4) ^ keystream[1]);
        view.setInt32(offset + 8, view.getInt32(offset + 8) ^ keystream[2]);
        view.setInt32(offset + 12, view.getInt32(offset + 12) ^ keystream[3]);
      }
      if (offset < length) {
        nextKeystream();
        for (let indexByte = 0; offset < length; offset++, indexByte++) {
          data[offset] ^= keystream[indexByte >> 2] >>> 24 - 8 * (indexByte & 3);
        }
      }
    }
    function nextKeystream() {
      counter0 = counter0 + 1 | 0;
      if (!counter0) {
        counter1 = counter1 + 1 | 0;
        if (!counter1) {
          counter2 = counter2 + 1 | 0;
          if (!counter2) {
            counter3 = counter3 + 1 | 0;
          }
        }
      }
      let s0 = swapBytes(counter0) ^ roundKeys[0];
      let s1 = swapBytes(counter1) ^ roundKeys[1];
      let s2 = swapBytes(counter2) ^ roundKeys[2];
      let s3 = swapBytes(counter3) ^ roundKeys[3];
      let t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[4];
      let t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[5];
      let t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[6];
      let t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[7];
      s0 = T02[t0 >>> 24] ^ T12[t1 >>> 16 & 255] ^ T22[t2 >>> 8 & 255] ^ T32[t3 & 255] ^ roundKeys[8];
      s1 = T02[t1 >>> 24] ^ T12[t2 >>> 16 & 255] ^ T22[t3 >>> 8 & 255] ^ T32[t0 & 255] ^ roundKeys[9];
      s2 = T02[t2 >>> 24] ^ T12[t3 >>> 16 & 255] ^ T22[t0 >>> 8 & 255] ^ T32[t1 & 255] ^ roundKeys[10];
      s3 = T02[t3 >>> 24] ^ T12[t0 >>> 16 & 255] ^ T22[t1 >>> 8 & 255] ^ T32[t2 & 255] ^ roundKeys[11];
      t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[12];
      t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[13];
      t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[14];
      t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[15];
      s0 = T02[t0 >>> 24] ^ T12[t1 >>> 16 & 255] ^ T22[t2 >>> 8 & 255] ^ T32[t3 & 255] ^ roundKeys[16];
      s1 = T02[t1 >>> 24] ^ T12[t2 >>> 16 & 255] ^ T22[t3 >>> 8 & 255] ^ T32[t0 & 255] ^ roundKeys[17];
      s2 = T02[t2 >>> 24] ^ T12[t3 >>> 16 & 255] ^ T22[t0 >>> 8 & 255] ^ T32[t1 & 255] ^ roundKeys[18];
      s3 = T02[t3 >>> 24] ^ T12[t0 >>> 16 & 255] ^ T22[t1 >>> 8 & 255] ^ T32[t2 & 255] ^ roundKeys[19];
      t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[20];
      t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[21];
      t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[22];
      t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[23];
      s0 = T02[t0 >>> 24] ^ T12[t1 >>> 16 & 255] ^ T22[t2 >>> 8 & 255] ^ T32[t3 & 255] ^ roundKeys[24];
      s1 = T02[t1 >>> 24] ^ T12[t2 >>> 16 & 255] ^ T22[t3 >>> 8 & 255] ^ T32[t0 & 255] ^ roundKeys[25];
      s2 = T02[t2 >>> 24] ^ T12[t3 >>> 16 & 255] ^ T22[t0 >>> 8 & 255] ^ T32[t1 & 255] ^ roundKeys[26];
      s3 = T02[t3 >>> 24] ^ T12[t0 >>> 16 & 255] ^ T22[t1 >>> 8 & 255] ^ T32[t2 & 255] ^ roundKeys[27];
      t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[28];
      t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[29];
      t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[30];
      t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[31];
      s0 = T02[t0 >>> 24] ^ T12[t1 >>> 16 & 255] ^ T22[t2 >>> 8 & 255] ^ T32[t3 & 255] ^ roundKeys[32];
      s1 = T02[t1 >>> 24] ^ T12[t2 >>> 16 & 255] ^ T22[t3 >>> 8 & 255] ^ T32[t0 & 255] ^ roundKeys[33];
      s2 = T02[t2 >>> 24] ^ T12[t3 >>> 16 & 255] ^ T22[t0 >>> 8 & 255] ^ T32[t1 & 255] ^ roundKeys[34];
      s3 = T02[t3 >>> 24] ^ T12[t0 >>> 16 & 255] ^ T22[t1 >>> 8 & 255] ^ T32[t2 & 255] ^ roundKeys[35];
      t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[36];
      t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[37];
      t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[38];
      t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[39];
      let indexKey = 40;
      if (rounds > 10) {
        s0 = T02[t0 >>> 24] ^ T12[t1 >>> 16 & 255] ^ T22[t2 >>> 8 & 255] ^ T32[t3 & 255] ^ roundKeys[40];
        s1 = T02[t1 >>> 24] ^ T12[t2 >>> 16 & 255] ^ T22[t3 >>> 8 & 255] ^ T32[t0 & 255] ^ roundKeys[41];
        s2 = T02[t2 >>> 24] ^ T12[t3 >>> 16 & 255] ^ T22[t0 >>> 8 & 255] ^ T32[t1 & 255] ^ roundKeys[42];
        s3 = T02[t3 >>> 24] ^ T12[t0 >>> 16 & 255] ^ T22[t1 >>> 8 & 255] ^ T32[t2 & 255] ^ roundKeys[43];
        t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[44];
        t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[45];
        t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[46];
        t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[47];
        indexKey = 48;
      }
      if (rounds > 12) {
        s0 = T02[t0 >>> 24] ^ T12[t1 >>> 16 & 255] ^ T22[t2 >>> 8 & 255] ^ T32[t3 & 255] ^ roundKeys[48];
        s1 = T02[t1 >>> 24] ^ T12[t2 >>> 16 & 255] ^ T22[t3 >>> 8 & 255] ^ T32[t0 & 255] ^ roundKeys[49];
        s2 = T02[t2 >>> 24] ^ T12[t3 >>> 16 & 255] ^ T22[t0 >>> 8 & 255] ^ T32[t1 & 255] ^ roundKeys[50];
        s3 = T02[t3 >>> 24] ^ T12[t0 >>> 16 & 255] ^ T22[t1 >>> 8 & 255] ^ T32[t2 & 255] ^ roundKeys[51];
        t0 = T02[s0 >>> 24] ^ T12[s1 >>> 16 & 255] ^ T22[s2 >>> 8 & 255] ^ T32[s3 & 255] ^ roundKeys[52];
        t1 = T02[s1 >>> 24] ^ T12[s2 >>> 16 & 255] ^ T22[s3 >>> 8 & 255] ^ T32[s0 & 255] ^ roundKeys[53];
        t2 = T02[s2 >>> 24] ^ T12[s3 >>> 16 & 255] ^ T22[s0 >>> 8 & 255] ^ T32[s1 & 255] ^ roundKeys[54];
        t3 = T02[s3 >>> 24] ^ T12[s0 >>> 16 & 255] ^ T22[s1 >>> 8 & 255] ^ T32[s2 & 255] ^ roundKeys[55];
        indexKey = 56;
      }
      keystream[0] = (S_BOX[t0 >>> 24] << 24 | S_BOX[t1 >>> 16 & 255] << 16 | S_BOX[t2 >>> 8 & 255] << 8 | S_BOX[t3 & 255]) ^ roundKeys[indexKey];
      keystream[1] = (S_BOX[t1 >>> 24] << 24 | S_BOX[t2 >>> 16 & 255] << 16 | S_BOX[t3 >>> 8 & 255] << 8 | S_BOX[t0 & 255]) ^ roundKeys[indexKey + 1];
      keystream[2] = (S_BOX[t2 >>> 24] << 24 | S_BOX[t3 >>> 16 & 255] << 16 | S_BOX[t0 >>> 8 & 255] << 8 | S_BOX[t1 & 255]) ^ roundKeys[indexKey + 2];
      keystream[3] = (S_BOX[t3 >>> 24] << 24 | S_BOX[t0 >>> 16 & 255] << 16 | S_BOX[t1 >>> 8 & 255] << 8 | S_BOX[t2 & 255]) ^ roundKeys[indexKey + 3];
    }
  }
  function pbkdf2(password, salt, iterations, length) {
    const hmac = createHmac(password);
    const result = new Uint8Array(length);
    const block = new Uint8Array(salt.length + 4);
    const blockView = new DataView(block.buffer);
    block.set(salt);
    for (let indexBlock = 1, offset = 0; offset < length; indexBlock++, offset += SHA1_DIGEST_LENGTH) {
      blockView.setUint32(salt.length, indexBlock);
      hmac.update(block, 0, block.length);
      let previous = hmac.digest();
      const output = previous.slice();
      for (let iteration = 1; iteration < iterations; iteration++) {
        hmac.update(previous, 0, SHA1_DIGEST_LENGTH);
        previous = hmac.digest();
        for (let indexByte = 0; indexByte < SHA1_DIGEST_LENGTH; indexByte++) {
          output[indexByte] ^= previous[indexByte];
        }
      }
      result.set(output.subarray(0, Math.min(SHA1_DIGEST_LENGTH, length - offset)), offset);
    }
    return result;
  }
  function createHmac(key) {
    const sha1 = createSha1();
    const innerKey = new Uint8Array(SHA1_BLOCK_LENGTH);
    const outerKey = new Uint8Array(SHA1_BLOCK_LENGTH);
    if (key.length > SHA1_BLOCK_LENGTH) {
      sha1.update(key, 0, key.length);
      key = sha1.digest();
    }
    for (let indexByte = 0; indexByte < SHA1_BLOCK_LENGTH; indexByte++) {
      const keyByte = indexByte < key.length ? key[indexByte] : 0;
      innerKey[indexByte] = keyByte ^ HMAC_INNER_PADDING;
      outerKey[indexByte] = keyByte ^ HMAC_OUTER_PADDING;
    }
    sha1.update(innerKey, 0, SHA1_BLOCK_LENGTH);
    return {
      update(data, offset, length) {
        sha1.update(data, offset, length);
      },
      digest() {
        const innerDigest = sha1.digest();
        sha1.update(outerKey, 0, SHA1_BLOCK_LENGTH);
        sha1.update(innerDigest, 0, SHA1_DIGEST_LENGTH);
        const result = sha1.digest();
        sha1.update(innerKey, 0, SHA1_BLOCK_LENGTH);
        return result;
      }
    };
  }
  function createSha1() {
    const state = new Int32Array(SHA1_INITIAL_STATE);
    const schedule = new Int32Array(SHA1_SCHEDULE_LENGTH);
    const block = new Uint8Array(SHA1_BLOCK_LENGTH);
    const blockView = new DataView(block.buffer);
    const lengthBytes = new Uint8Array(8);
    let blockLength = 0;
    let totalLength = 0;
    return {
      update,
      digest
    };
    function update(data, offset, length) {
      const end = offset + length;
      totalLength += length;
      if (blockLength) {
        while (offset < end && blockLength < SHA1_BLOCK_LENGTH) {
          block[blockLength++] = data[offset++];
        }
        if (blockLength == SHA1_BLOCK_LENGTH) {
          compress(blockView, 0);
          blockLength = 0;
        }
      }
      if (offset + SHA1_BLOCK_LENGTH <= end) {
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        for (; offset + SHA1_BLOCK_LENGTH <= end; offset += SHA1_BLOCK_LENGTH) {
          compress(view, offset);
        }
      }
      while (offset < end) {
        block[blockLength++] = data[offset++];
      }
    }
    function digest() {
      const bits = totalLength * 8;
      const high = Math.floor(bits / 4294967296);
      const low = bits >>> 0;
      update(SHA1_PADDING, 0, 1);
      while (blockLength != SHA1_LENGTH_OFFSET) {
        update(SHA1_ZERO, 0, 1);
      }
      lengthBytes[0] = high >>> 24;
      lengthBytes[1] = high >>> 16;
      lengthBytes[2] = high >>> 8;
      lengthBytes[3] = high;
      lengthBytes[4] = low >>> 24;
      lengthBytes[5] = low >>> 16;
      lengthBytes[6] = low >>> 8;
      lengthBytes[7] = low;
      update(lengthBytes, 0, 8);
      const result = new Uint8Array(SHA1_DIGEST_LENGTH);
      const resultView = new DataView(result.buffer);
      for (let indexWord = 0; indexWord < state.length; indexWord++) {
        resultView.setInt32(4 * indexWord, state[indexWord]);
      }
      state.set(SHA1_INITIAL_STATE);
      blockLength = 0;
      totalLength = 0;
      return result;
    }
    function compress(view, offset) {
      for (let index = 0; index < 16; index++) {
        schedule[index] = view.getInt32(offset + 4 * index);
      }
      let a = state[0];
      let b = state[1];
      let c = state[2];
      let d = state[3];
      let e = state[4];
      let t;
      for (let index = 0; index < 15; index += 5) {
        e = (a << 5 | a >>> 27) + ((c ^ d) & b ^ d) + e + 1518500249 + schedule[index] | 0;
        b = b << 30 | b >>> 2;
        d = (e << 5 | e >>> 27) + ((b ^ c) & a ^ c) + d + 1518500249 + schedule[index + 1] | 0;
        a = a << 30 | a >>> 2;
        c = (d << 5 | d >>> 27) + ((a ^ b) & e ^ b) + c + 1518500249 + schedule[index + 2] | 0;
        e = e << 30 | e >>> 2;
        b = (c << 5 | c >>> 27) + ((e ^ a) & d ^ a) + b + 1518500249 + schedule[index + 3] | 0;
        d = d << 30 | d >>> 2;
        a = (b << 5 | b >>> 27) + ((d ^ e) & c ^ e) + a + 1518500249 + schedule[index + 4] | 0;
        c = c << 30 | c >>> 2;
      }
      e = (a << 5 | a >>> 27) + ((c ^ d) & b ^ d) + e + 1518500249 + schedule[15] | 0;
      b = b << 30 | b >>> 2;
      t = schedule[13] ^ schedule[8] ^ schedule[2] ^ schedule[0];
      t = t << 1 | t >>> 31;
      schedule[0] = t;
      d = (e << 5 | e >>> 27) + ((b ^ c) & a ^ c) + d + 1518500249 + t | 0;
      a = a << 30 | a >>> 2;
      t = schedule[14] ^ schedule[9] ^ schedule[3] ^ schedule[1];
      t = t << 1 | t >>> 31;
      schedule[1] = t;
      c = (d << 5 | d >>> 27) + ((a ^ b) & e ^ b) + c + 1518500249 + t | 0;
      e = e << 30 | e >>> 2;
      t = schedule[15] ^ schedule[10] ^ schedule[4] ^ schedule[2];
      t = t << 1 | t >>> 31;
      schedule[2] = t;
      b = (c << 5 | c >>> 27) + ((e ^ a) & d ^ a) + b + 1518500249 + t | 0;
      d = d << 30 | d >>> 2;
      t = schedule[0] ^ schedule[11] ^ schedule[5] ^ schedule[3];
      t = t << 1 | t >>> 31;
      schedule[3] = t;
      a = (b << 5 | b >>> 27) + ((d ^ e) & c ^ e) + a + 1518500249 + t | 0;
      c = c << 30 | c >>> 2;
      for (let index = 20; index < 40; index += 5) {
        t = schedule[index - 3 & 15] ^ schedule[index - 8 & 15] ^ schedule[index - 14 & 15] ^ schedule[index & 15];
        t = t << 1 | t >>> 31;
        schedule[index & 15] = t;
        e = (a << 5 | a >>> 27) + (b ^ c ^ d) + e + 1859775393 + t | 0;
        b = b << 30 | b >>> 2;
        t = schedule[index - 2 & 15] ^ schedule[index - 7 & 15] ^ schedule[index - 13 & 15] ^ schedule[index + 1 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 1 & 15] = t;
        d = (e << 5 | e >>> 27) + (a ^ b ^ c) + d + 1859775393 + t | 0;
        a = a << 30 | a >>> 2;
        t = schedule[index - 1 & 15] ^ schedule[index - 6 & 15] ^ schedule[index - 12 & 15] ^ schedule[index + 2 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 2 & 15] = t;
        c = (d << 5 | d >>> 27) + (e ^ a ^ b) + c + 1859775393 + t | 0;
        e = e << 30 | e >>> 2;
        t = schedule[index & 15] ^ schedule[index - 5 & 15] ^ schedule[index - 11 & 15] ^ schedule[index + 3 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 3 & 15] = t;
        b = (c << 5 | c >>> 27) + (d ^ e ^ a) + b + 1859775393 + t | 0;
        d = d << 30 | d >>> 2;
        t = schedule[index + 1 & 15] ^ schedule[index - 4 & 15] ^ schedule[index - 10 & 15] ^ schedule[index + 4 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 4 & 15] = t;
        a = (b << 5 | b >>> 27) + (c ^ d ^ e) + a + 1859775393 + t | 0;
        c = c << 30 | c >>> 2;
      }
      for (let index = 40; index < 60; index += 5) {
        t = schedule[index - 3 & 15] ^ schedule[index - 8 & 15] ^ schedule[index - 14 & 15] ^ schedule[index & 15];
        t = t << 1 | t >>> 31;
        schedule[index & 15] = t;
        e = (a << 5 | a >>> 27) + (b & c | (b | c) & d) + e + 2400959708 + t | 0;
        b = b << 30 | b >>> 2;
        t = schedule[index - 2 & 15] ^ schedule[index - 7 & 15] ^ schedule[index - 13 & 15] ^ schedule[index + 1 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 1 & 15] = t;
        d = (e << 5 | e >>> 27) + (a & b | (a | b) & c) + d + 2400959708 + t | 0;
        a = a << 30 | a >>> 2;
        t = schedule[index - 1 & 15] ^ schedule[index - 6 & 15] ^ schedule[index - 12 & 15] ^ schedule[index + 2 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 2 & 15] = t;
        c = (d << 5 | d >>> 27) + (e & a | (e | a) & b) + c + 2400959708 + t | 0;
        e = e << 30 | e >>> 2;
        t = schedule[index & 15] ^ schedule[index - 5 & 15] ^ schedule[index - 11 & 15] ^ schedule[index + 3 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 3 & 15] = t;
        b = (c << 5 | c >>> 27) + (d & e | (d | e) & a) + b + 2400959708 + t | 0;
        d = d << 30 | d >>> 2;
        t = schedule[index + 1 & 15] ^ schedule[index - 4 & 15] ^ schedule[index - 10 & 15] ^ schedule[index + 4 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 4 & 15] = t;
        a = (b << 5 | b >>> 27) + (c & d | (c | d) & e) + a + 2400959708 + t | 0;
        c = c << 30 | c >>> 2;
      }
      for (let index = 60; index < 80; index += 5) {
        t = schedule[index - 3 & 15] ^ schedule[index - 8 & 15] ^ schedule[index - 14 & 15] ^ schedule[index & 15];
        t = t << 1 | t >>> 31;
        schedule[index & 15] = t;
        e = (a << 5 | a >>> 27) + (b ^ c ^ d) + e + 3395469782 + t | 0;
        b = b << 30 | b >>> 2;
        t = schedule[index - 2 & 15] ^ schedule[index - 7 & 15] ^ schedule[index - 13 & 15] ^ schedule[index + 1 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 1 & 15] = t;
        d = (e << 5 | e >>> 27) + (a ^ b ^ c) + d + 3395469782 + t | 0;
        a = a << 30 | a >>> 2;
        t = schedule[index - 1 & 15] ^ schedule[index - 6 & 15] ^ schedule[index - 12 & 15] ^ schedule[index + 2 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 2 & 15] = t;
        c = (d << 5 | d >>> 27) + (e ^ a ^ b) + c + 3395469782 + t | 0;
        e = e << 30 | e >>> 2;
        t = schedule[index & 15] ^ schedule[index - 5 & 15] ^ schedule[index - 11 & 15] ^ schedule[index + 3 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 3 & 15] = t;
        b = (c << 5 | c >>> 27) + (d ^ e ^ a) + b + 3395469782 + t | 0;
        d = d << 30 | d >>> 2;
        t = schedule[index + 1 & 15] ^ schedule[index - 4 & 15] ^ schedule[index - 10 & 15] ^ schedule[index + 4 & 15];
        t = t << 1 | t >>> 31;
        schedule[index + 4 & 15] = t;
        a = (b << 5 | b >>> 27) + (c ^ d ^ e) + a + 3395469782 + t | 0;
        c = c << 30 | c >>> 2;
      }
      state[0] = state[0] + a | 0;
      state[1] = state[1] + b | 0;
      state[2] = state[2] + c | 0;
      state[3] = state[3] + d | 0;
      state[4] = state[4] + e | 0;
    }
  }
  function initTables() {
    if (!tablesInitialized) {
      let p2 = 1;
      let q2 = 1;
      do {
        p2 = (p2 ^ p2 << 1 ^ (p2 & 128 ? 27 : 0)) & 255;
        q2 = (q2 ^ q2 << 1) & 255;
        q2 = (q2 ^ q2 << 2) & 255;
        q2 = (q2 ^ q2 << 4) & 255;
        if (q2 & 128) {
          q2 ^= 9;
        }
        S_BOX[p2] = (q2 ^ (q2 << 1 | q2 >> 7) ^ (q2 << 2 | q2 >> 6) ^ (q2 << 3 | q2 >> 5) ^ (q2 << 4 | q2 >> 4) ^ 99) & 255;
      } while (p2 != 1);
      S_BOX[0] = 99;
      for (let index = 0; index < 256; index++) {
        const s = S_BOX[index];
        const s2 = multiplyByTwo(s);
        const t = s2 << 24 | s << 16 | s << 8 | s2 ^ s;
        T02[index] = t;
        T12[index] = t >>> 8 | t << 24;
        T22[index] = t >>> 16 | t << 16;
        T32[index] = t >>> 24 | t << 8;
      }
      tablesInitialized = true;
    }
  }
  function expandKey(key, roundKeys) {
    const keyWords = key.length >> 2;
    const rounds = keyWords + 6;
    const total = 4 * (rounds + 1);
    let roundConstant = 1;
    for (let index = 0; index < keyWords; index++) {
      roundKeys[index] = key[4 * index] << 24 | key[4 * index + 1] << 16 | key[4 * index + 2] << 8 | key[4 * index + 3];
    }
    for (let index = keyWords; index < total; index++) {
      let word = roundKeys[index - 1];
      if (index % keyWords == 0) {
        word = substituteWord(word << 8 | word >>> 24) ^ roundConstant << 24;
        roundConstant = multiplyByTwo(roundConstant);
      } else if (keyWords > 6 && index % keyWords == 4) {
        word = substituteWord(word);
      }
      roundKeys[index] = roundKeys[index - keyWords] ^ word;
    }
    return rounds;
  }
  function substituteWord(word) {
    return S_BOX[word >>> 24] << 24 | S_BOX[word >>> 16 & 255] << 16 | S_BOX[word >>> 8 & 255] << 8 | S_BOX[word & 255];
  }
  function swapBytes(value) {
    return value << 24 | (value & 65280) << 8 | value >>> 8 & 65280 | value >>> 24;
  }
  function multiplyByTwo(value) {
    return (value << 1 ^ (value >> 7) * 27) & 255;
  }
  var BLOCK_LENGTH, ROUND_KEYS_LENGTH, SHA1_BLOCK_LENGTH, SHA1_DIGEST_LENGTH, SHA1_SCHEDULE_LENGTH, SHA1_LENGTH_OFFSET, SHA1_PADDING, SHA1_ZERO, SHA1_INITIAL_STATE, HMAC_INNER_PADDING, HMAC_OUTER_PADDING, S_BOX, T02, T12, T22, T32, tablesInitialized;
  var init_aes_hmac_sha1 = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/codecs/aes-hmac-sha1.js"() {
      BLOCK_LENGTH = 16;
      ROUND_KEYS_LENGTH = 60;
      SHA1_BLOCK_LENGTH = 64;
      SHA1_DIGEST_LENGTH = 20;
      SHA1_SCHEDULE_LENGTH = 16;
      SHA1_LENGTH_OFFSET = 56;
      SHA1_PADDING = new Uint8Array([128]);
      SHA1_ZERO = new Uint8Array(1);
      SHA1_INITIAL_STATE = new Int32Array([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      HMAC_INNER_PADDING = 54;
      HMAC_OUTER_PADDING = 92;
      S_BOX = new Uint8Array(256);
      T02 = new Int32Array(256);
      T12 = new Int32Array(256);
      T22 = new Int32Array(256);
      T32 = new Int32Array(256);
      tablesInitialized = false;
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/common-crypto.js
  function getRandomValues(array) {
    if (GET_RANDOM_VALUES_SUPPORTED) {
      return crypto.getRandomValues(array);
    } else {
      throw new Error(ERR_UNSUPPORTED_CRYPTO_API);
    }
  }
  var GET_RANDOM_VALUES_SUPPORTED, ERR_INVALID_PASSWORD, ERR_INVALID_AUTHENTICATION_CODE, ERR_ABORT_CHECK_PASSWORD, ERR_UNSUPPORTED_CRYPTO_API;
  var init_common_crypto = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/common-crypto.js"() {
      init_constants();
      GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;
      ERR_INVALID_PASSWORD = "Invalid password";
      ERR_INVALID_AUTHENTICATION_CODE = "Invalid authentication code";
      ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";
      ERR_UNSUPPORTED_CRYPTO_API = "Crypto API not supported";
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/aes-crypto-stream.js
  function initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength) {
    Object.assign(aesCrypto, {
      ready: new Promise((resolve) => aesCrypto.resolveReady = resolve),
      password: encodePassword(password, rawPassword),
      strength: encryptionStrength - 1,
      pendingInput: EMPTY_UINT8_ARRAY,
      discarded: false
    });
  }
  function setDisposingReadable(stream, aesCrypto) {
    const reader = stream.readable.getReader();
    const readable = new ReadableStream({
      async pull(controller) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        } catch (error) {
          disposeEngine(aesCrypto);
          reader.cancel(error).catch(() => {
          });
          throw error;
        }
      },
      cancel(reason) {
        disposeEngine(aesCrypto);
        return reader.cancel(reason);
      }
    });
    Object.defineProperty(stream, "readable", {
      get() {
        return readable;
      }
    });
  }
  function append(aesCrypto, input, output, paddingStart, paddingEnd, decrypt2) {
    const {
      engine,
      pendingInput
    } = aesCrypto;
    if (pendingInput.length) {
      input = concat(pendingInput, input);
    }
    const inputLength = input.length - paddingEnd;
    const alignedLength = inputLength - inputLength % BLOCK_LENGTH2;
    output = expand(output, paddingStart + alignedLength);
    if (alignedLength) {
      const chunk = subarray(output, paddingStart, paddingStart + alignedLength);
      chunk.set(subarray(input, 0, alignedLength));
      engine.process(chunk, decrypt2);
    }
    aesCrypto.pendingInput = subarray(input, alignedLength);
    return output;
  }
  async function createDecryptionKeys(decrypt2, strength, password, preamble) {
    const passwordVerificationKey = await createKeys(decrypt2, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
    const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
    if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
      disposeEngine(decrypt2);
      throw new Error(ERR_INVALID_PASSWORD);
    }
  }
  function disposeEngine(aesCrypto) {
    const { engine } = aesCrypto;
    aesCrypto.discarded = true;
    if (engine && engine.dispose) {
      engine.dispose();
    }
  }
  async function createEncryptionKeys(encrypt2, strength, password) {
    const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
    const passwordVerification = await createKeys(encrypt2, strength, password, salt);
    return concat(salt, passwordVerification);
  }
  async function createKeys(aesCrypto, strength, password, salt) {
    aesCrypto.password = null;
    const keyLength = KEY_LENGTH[strength];
    const compositeKey = await deriveKey(password, salt, keyLength * 2 + PASSWORD_VERIFICATION_LENGTH);
    aesCrypto.engine = createEngine2(subarray(compositeKey, 0, keyLength), subarray(compositeKey, keyLength, keyLength * 2));
    if (aesCrypto.discarded) {
      disposeEngine(aesCrypto);
    }
    return subarray(compositeKey, keyLength * 2);
  }
  async function deriveKey(password, salt, length) {
    if (DERIVE_BITS_SUPPORTED) {
      try {
        const baseKey = await subtle.importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
        return new Uint8Array(await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, length * 8));
      } catch {
        DERIVE_BITS_SUPPORTED = false;
      }
    }
    return pbkdf2(password, salt, PBKDF2_ITERATIONS, length);
  }
  function encodePassword(password, rawPassword) {
    if (rawPassword === UNDEFINED_VALUE) {
      return encodeText(password);
    } else {
      return rawPassword;
    }
  }
  function expand(inputArray, length) {
    if (length && length > inputArray.length) {
      const array = inputArray;
      inputArray = new Uint8Array(length);
      inputArray.set(array, 0);
    }
    return inputArray;
  }
  function subarray(array, begin, end) {
    return array.subarray(begin, end);
  }
  var BLOCK_LENGTH2, RAW_FORMAT, PBKDF2_ALGORITHM, HASH_ALGORITHM, HASH_FUNCTION, PBKDF2_ITERATIONS, BASE_KEY_ALGORITHM, DERIVED_BITS_ALGORITHM, DERIVED_BITS_USAGE, SALT_LENGTH, KEY_LENGTH, AUTHENTICATION_CODE_LENGTH, PASSWORD_VERIFICATION_LENGTH, CRYPTO_API_SUPPORTED, subtle, SUBTLE_API_SUPPORTED, DERIVE_BITS_SUPPORTED, createEngine2, AESDecryptionStream, AESEncryptionStream;
  var init_aes_crypto_stream = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/aes-crypto-stream.js"() {
      init_constants();
      init_encode_text();
      init_array();
      init_aes_hmac_sha1();
      init_common_crypto();
      BLOCK_LENGTH2 = 16;
      RAW_FORMAT = "raw";
      PBKDF2_ALGORITHM = { name: "PBKDF2" };
      HASH_ALGORITHM = { name: "HMAC" };
      HASH_FUNCTION = "SHA-1";
      PBKDF2_ITERATIONS = 1e3;
      BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
      DERIVED_BITS_ALGORITHM = Object.assign({ iterations: PBKDF2_ITERATIONS, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
      DERIVED_BITS_USAGE = ["deriveBits"];
      SALT_LENGTH = [8, 12, 16];
      KEY_LENGTH = [16, 24, 32];
      AUTHENTICATION_CODE_LENGTH = 10;
      PASSWORD_VERIFICATION_LENGTH = 2;
      CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
      subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
      SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;
      DERIVE_BITS_SUPPORTED = SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE && typeof subtle.deriveBits == FUNCTION_TYPE;
      createEngine2 = createEngine;
      AESDecryptionStream = class extends TransformStream {
        constructor({ password, rawPassword, encryptionStrength, checkPasswordOnly, checkAuthenticationCode = true }) {
          const aesCrypto = {};
          super({
            start() {
              initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength);
            },
            async transform(chunk, controller) {
              const {
                password: password2,
                strength,
                resolveReady,
                ready
              } = aesCrypto;
              if (password2) {
                await createDecryptionKeys(aesCrypto, strength, password2, subarray(chunk, 0, SALT_LENGTH[strength] + PASSWORD_VERIFICATION_LENGTH));
                chunk = subarray(chunk, SALT_LENGTH[strength] + PASSWORD_VERIFICATION_LENGTH);
                if (checkPasswordOnly) {
                  disposeEngine(aesCrypto);
                  controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
                } else {
                  resolveReady();
                }
              } else {
                await ready;
              }
              if (aesCrypto.discarded) {
                return;
              }
              const output = new Uint8Array(chunk.length - AUTHENTICATION_CODE_LENGTH - (chunk.length - AUTHENTICATION_CODE_LENGTH) % BLOCK_LENGTH2);
              controller.enqueue(append(aesCrypto, chunk, output, 0, AUTHENTICATION_CODE_LENGTH, true));
            },
            async flush(controller) {
              const {
                engine,
                pendingInput,
                ready
              } = aesCrypto;
              if (engine) {
                await ready;
                if (aesCrypto.discarded) {
                  return;
                }
                const originalAuthenticationCode = subarray(pendingInput, pendingInput.length - AUTHENTICATION_CODE_LENGTH);
                const decryptedChunkArray = new Uint8Array(subarray(pendingInput, 0, pendingInput.length - AUTHENTICATION_CODE_LENGTH));
                engine.process(decryptedChunkArray, true);
                const authenticationCode = engine.digest();
                let invalidAuthenticationCode = pendingInput.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;
                for (let indexByte = 0; indexByte < AUTHENTICATION_CODE_LENGTH; indexByte++) {
                  invalidAuthenticationCode |= authenticationCode[indexByte] ^ originalAuthenticationCode[indexByte];
                }
                if (invalidAuthenticationCode && checkAuthenticationCode) {
                  controller.error(new Error(ERR_INVALID_AUTHENTICATION_CODE));
                  return;
                }
                controller.enqueue(decryptedChunkArray);
              }
            }
          });
          setDisposingReadable(this, aesCrypto);
        }
      };
      AESEncryptionStream = class extends TransformStream {
        constructor({ password, rawPassword, encryptionStrength }) {
          const aesCrypto = {};
          super({
            start() {
              initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength);
            },
            async transform(chunk, controller) {
              const {
                password: password2,
                strength,
                resolveReady,
                ready
              } = aesCrypto;
              let preamble = EMPTY_UINT8_ARRAY;
              if (password2) {
                preamble = await createEncryptionKeys(aesCrypto, strength, password2);
                resolveReady();
              } else {
                await ready;
              }
              if (aesCrypto.discarded) {
                return;
              }
              const output = new Uint8Array(preamble.length + chunk.length - chunk.length % BLOCK_LENGTH2);
              output.set(preamble, 0);
              controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0, false));
            },
            async flush(controller) {
              const {
                engine,
                pendingInput,
                ready
              } = aesCrypto;
              if (engine) {
                await ready;
                if (aesCrypto.discarded) {
                  return;
                }
                const encryptedChunkArray = new Uint8Array(pendingInput);
                engine.process(encryptedChunkArray, false);
                const authenticationCode = subarray(engine.digest(), 0, AUTHENTICATION_CODE_LENGTH);
                controller.enqueue(concat(encryptedChunkArray, authenticationCode));
              }
            }
          });
          setDisposingReadable(this, aesCrypto);
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/zip-crypto-stream.js
  function initZipCrypto(zipCrypto, password, rawPassword, passwordVerification) {
    Object.assign(zipCrypto, {
      password,
      rawPassword,
      passwordVerification
    });
    createKeys2(zipCrypto, password, rawPassword);
  }
  function decrypt(target, input) {
    const output = new Uint8Array(input.length);
    for (let index = 0; index < input.length; index++) {
      output[index] = getByte(target) ^ input[index];
      updateKeys(target, output[index]);
    }
    return output;
  }
  function encrypt(target, input) {
    const output = new Uint8Array(input.length);
    for (let index = 0; index < input.length; index++) {
      output[index] = getByte(target) ^ input[index];
      updateKeys(target, input[index]);
    }
    return output;
  }
  function createKeys2(target, password, rawPassword) {
    const cryptoKeys = [305419896, 591751049, 878082192];
    Object.assign(target, {
      cryptoKeys,
      crcKey0: new Crc32(cryptoKeys[0]),
      crcKey2: new Crc32(cryptoKeys[2])
    });
    if (rawPassword) {
      for (let index = 0; index < rawPassword.length; index++) {
        updateKeys(target, rawPassword[index]);
      }
    } else {
      for (let index = 0; index < password.length; index++) {
        updateKeys(target, password.charCodeAt(index));
      }
    }
  }
  function updateKeys(target, byte) {
    let [, key1] = target.cryptoKeys;
    target.crcKey0.append([byte]);
    const key0 = ~target.crcKey0.get();
    key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
    target.crcKey2.append([key1 >>> 24]);
    const key2 = ~target.crcKey2.get();
    target.cryptoKeys = [key0, key1, key2];
  }
  function getByte(target) {
    const temp = target.cryptoKeys[2] | 2;
    return getInt8(Math.imul(temp, temp ^ 1) >>> 8);
  }
  function getInt8(number) {
    return number & 255;
  }
  function getInt32(number) {
    return number & 4294967295;
  }
  var HEADER_LENGTH, ZipCryptoDecryptionStream, ZipCryptoEncryptionStream;
  var init_zip_crypto_stream = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/zip-crypto-stream.js"() {
      init_crc32();
      init_common_crypto();
      HEADER_LENGTH = 12;
      ZipCryptoDecryptionStream = class extends TransformStream {
        constructor({ password, rawPassword, passwordVerification, checkPasswordOnly }) {
          super({
            start() {
              initZipCrypto(this, password, rawPassword, passwordVerification);
            },
            transform(chunk, controller) {
              const zipCrypto = this;
              if (zipCrypto.password || zipCrypto.rawPassword) {
                const decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));
                zipCrypto.password = zipCrypto.rawPassword = null;
                if ((decryptedHeader[HEADER_LENGTH - 1] ^ zipCrypto.passwordVerification) != 0) {
                  throw new Error(ERR_INVALID_PASSWORD);
                }
                chunk = chunk.subarray(HEADER_LENGTH);
              }
              if (checkPasswordOnly) {
                controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
              } else {
                controller.enqueue(decrypt(zipCrypto, chunk));
              }
            }
          });
        }
      };
      ZipCryptoEncryptionStream = class extends TransformStream {
        constructor({ password, rawPassword, passwordVerification }) {
          super({
            start() {
              initZipCrypto(this, password, rawPassword, passwordVerification);
            },
            transform(chunk, controller) {
              const zipCrypto = this;
              let output;
              let offset;
              if (zipCrypto.password || zipCrypto.rawPassword) {
                zipCrypto.password = zipCrypto.rawPassword = null;
                const header = getRandomValues(new Uint8Array(HEADER_LENGTH));
                header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
                output = new Uint8Array(chunk.length + header.length);
                output.set(encrypt(zipCrypto, header), 0);
                offset = HEADER_LENGTH;
              } else {
                output = new Uint8Array(chunk.length);
                offset = 0;
              }
              output.set(encrypt(zipCrypto, chunk), offset);
              controller.enqueue(output);
            }
          });
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/compatible-streams.js
  function toCompatibleReadable(readable) {
    if (readable instanceof ReadableStream) {
      return readable;
    }
    const reader = readable.getReader();
    return new ReadableStream({
      async pull(controller) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        } catch (error) {
          reader.cancel(error).catch(() => {
          });
          throw error;
        }
      },
      cancel(reason) {
        return reader.cancel(reason);
      }
    });
  }
  function streamToBlob(readable, contentType) {
    readable = toCompatibleReadable(readable);
    const blobOptions = contentType ? { type: contentType } : {};
    if (responseSupportsGlobalReadable()) {
      return new Response(readable).blob().then((blob) => contentType ? new Blob([blob], blobOptions) : blob);
    }
    const chunks = [];
    return readable.pipeTo(new WritableStream({
      write(chunk) {
        chunks.push(chunk);
      }
    })).then(() => new Blob(chunks, blobOptions));
  }
  function responseSupportsGlobalReadable() {
    return typeof Blob.prototype.stream != FUNCTION_TYPE || new Blob([]).stream() instanceof ReadableStream;
  }
  function toCompatibleWritable(writable) {
    if (writable instanceof WritableStream) {
      return writable;
    }
    const writer = writable.getWriter();
    return new WritableStream({
      write(chunk) {
        return writer.write(chunk);
      },
      close() {
        return writer.close();
      },
      abort(reason) {
        return writer.abort(reason);
      }
    });
  }
  var init_compatible_streams = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/compatible-streams.js"() {
      init_constants();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/codec-registry.js
  function getRegisteredCodec(compressionMethod) {
    return registeredCodecs.get(compressionMethod);
  }
  function getCodecStreams(format) {
    return codecStreams.get(format);
  }
  function setCodecStreams(format, streams) {
    const { CompressionStream: CompressionStream2, DecompressionStream: DecompressionStream2 } = streams;
    if (typeof CompressionStream2 != FUNCTION_TYPE && typeof DecompressionStream2 != FUNCTION_TYPE) {
      throw new Error(ERR_INVALID_CODEC_MODULE);
    }
    codecStreams.set(format, { CompressionStream: CompressionStream2, DecompressionStream: DecompressionStream2 });
  }
  async function ensureCodecStreams(format, codecURI) {
    if (!codecStreams.has(format) && codecURI) {
      setCodecStreams(format, await import(
        /* webpackIgnore: true */
        /* @vite-ignore */
        codecURI
      ));
    }
  }
  var ERR_INVALID_CODEC_MODULE, ERR_UNSUPPORTED_COMPRESSION, registeredCodecs, codecStreams;
  var init_codec_registry = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/codec-registry.js"() {
      init_constants();
      ERR_INVALID_CODEC_MODULE = "Invalid codec module";
      ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
      registeredCodecs = /* @__PURE__ */ new Map();
      codecStreams = /* @__PURE__ */ new Map();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/zip-entry-stream.js
  function pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, crc32, sourceErrors) {
    const writer = gzipStream.writable.getWriter();
    const reader = gzipStream.readable.getReader();
    const outputCrc32 = crc32 === UNDEFINED_VALUE ? new Crc32() : UNDEFINED_VALUE;
    let outputLength = 0;
    let trailerWritten = false;
    let settled = false;
    let resolvePull, controller;
    const output = new ReadableStream({
      start(streamController) {
        controller = streamController;
      },
      pull() {
        resumePump();
      },
      cancel(reason) {
        settled = true;
        resumePump();
        return reader.cancel(reason);
      }
    });
    pump();
    drain();
    return output;
    async function pump() {
      const inputReader = readable.getReader();
      try {
        const header = new Uint8Array(GZIP_HEADER_LENGTH);
        header.set(GZIP_HEADER_BYTES);
        await writer.write(header);
        for (; ; ) {
          await outputCapacity();
          await writer.ready;
          const { value, done } = await readSource(inputReader, sourceErrors);
          if (done) {
            break;
          }
          await writer.write(value);
        }
        if (outputCrc32) {
          await writer.write(new Uint8Array(0));
        }
        const trailer = new Uint8Array(GZIP_TRAILER_LENGTH);
        const dataView = getDataView(trailer);
        dataView.setUint32(0, outputCrc32 ? outputCrc32.get() : crc32, true);
        dataView.setUint32(4, outputSize, true);
        trailerWritten = true;
        await writer.write(trailer);
        await writer.close();
      } catch (error) {
        await abort(writer, error);
        await cancel(inputReader, error);
      }
    }
    async function drain() {
      try {
        for (; ; ) {
          const { value, done } = await read();
          if (done) {
            break;
          }
          outputLength += value.length;
          if (outputLength > outputSize) {
            throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
          }
          if (outputCrc32) {
            outputCrc32.append(value);
          }
          controller.enqueue(value);
        }
        if (!settled) {
          settled = true;
          controller.close();
        }
      } catch (error) {
        fail(error);
        await cancel(reader, error);
      }
    }
    function read() {
      return reader.read().catch((error) => {
        if (trailerWritten) {
          if (!outputCrc32) {
            throw mapError(error, ERR_INVALID_CRC32);
          }
          if (outputLength != outputSize) {
            throw mapError(error, ERR_INVALID_UNCOMPRESSED_SIZE);
          }
          return { done: true };
        }
        throw mapCodecError(error, sourceErrors);
      });
    }
    function outputCapacity() {
      if (!settled && controller.desiredSize <= 0) {
        return new Promise((resolve) => resolvePull = resolve);
      }
    }
    function resumePump() {
      if (resolvePull) {
        const resolve = resolvePull;
        resolvePull = UNDEFINED_VALUE;
        resolve();
      }
    }
    function fail(error) {
      if (!settled) {
        settled = true;
        controller.error(error);
        resumePump();
      }
    }
  }
  function supportsFormat(StreamClass, format) {
    if (!StreamClass) {
      return false;
    }
    let supportByFormat = formatSupportByStream.get(StreamClass);
    if (!supportByFormat) {
      supportByFormat = /* @__PURE__ */ new Map();
      formatSupportByStream.set(StreamClass, supportByFormat);
    }
    let supported = supportByFormat.get(format);
    if (supported === UNDEFINED_VALUE) {
      try {
        new StreamClass(format);
        supported = true;
      } catch {
        supported = false;
      }
      supportByFormat.set(format, supported);
    }
    return supported;
  }
  function supportsDeflateRaw(StreamClass) {
    return supportsFormat(StreamClass, FORMAT_DEFLATE_RAW);
  }
  function supportsGzip(StreamClass) {
    return supportsFormat(StreamClass, FORMAT_GZIP);
  }
  function setReadable(stream, readable, flush) {
    readable = pipeThrough(readable, new TransformStream({ flush }));
    Object.defineProperty(stream, "readable", {
      get() {
        return readable;
      }
    });
  }
  function createCodecStream(CodecStreamClass, format, options) {
    if (!CodecStreamClass) {
      throw new Error(ERR_UNSUPPORTED_COMPRESSION);
    }
    return new CodecStreamClass(format, options);
  }
  function getGzipCodecStream(useCompressionStream, CodecStreamNative, CodecStreamFallback) {
    if (useCompressionStream && CodecStreamNative) {
      return CodecStreamNative;
    } else if (CodecStreamFallback && CodecStreamFallback.requiresModule) {
      return CodecStreamFallback;
    }
  }
  function pipeThroughCompressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamFallback, sourceErrors) {
    const Stream2 = useCompressionStream && CompressionStreamNative ? CompressionStreamNative : CompressionStreamFallback || CompressionStreamNative;
    const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
    let codecStream;
    try {
      codecStream = new Stream2(format, options);
    } catch (error) {
      if (useCompressionStream && CompressionStreamFallback && Stream2 != CompressionStreamFallback) {
        codecStream = new CompressionStreamFallback(format, options);
      } else {
        throw error;
      }
    }
    return pipeThroughBackpressured(readable, codecStream, sourceErrors);
  }
  function pipeThrough(readable, transformStream) {
    return toCompatibleReadable(readable).pipeThrough(transformStream);
  }
  function pipeThroughBackpressured(readable, transformStream, sourceErrors) {
    const writer = transformStream.writable.getWriter();
    const reader = readable.getReader();
    pump();
    return transformStream.readable;
    async function pump() {
      try {
        for (; ; ) {
          await writer.ready;
          const result = await readSource(reader, sourceErrors);
          if (result.done) {
            await writer.close();
            break;
          }
          await writer.write(result.value);
        }
      } catch (error) {
        await abort(writer, error);
        await cancel(reader, error);
      }
    }
  }
  async function abort(writer, error) {
    try {
      await writer.abort(error);
    } catch {
    }
  }
  async function cancel(reader, error) {
    try {
      await reader.cancel(error);
    } catch {
    }
  }
  function readSource(reader, sourceErrors) {
    const result = reader.read();
    return sourceErrors ? result.catch((error) => {
      sourceErrors.add(error);
      throw error;
    }) : result;
  }
  function mapCodecError(error, sourceErrors) {
    if (sourceErrors.has(error)) {
      return error;
    }
    return mapError(error, isMemoryError(error) ? ERR_CODEC_OUT_OF_MEMORY : ERR_INVALID_COMPRESSED_DATA);
  }
  function mapMemoryError(error) {
    return isMemoryError(error) ? mapError(error, ERR_CODEC_OUT_OF_MEMORY) : error;
  }
  function isMemoryError(error) {
    return isErrorObject(error) && error.code == Z_MEM_ERROR_CODE;
  }
  function mapError(error, message) {
    const mappedError = new Error(message);
    mappedError.cause = error;
    return mappedError;
  }
  function mapInflateStreamError(readable, sourceErrors) {
    const reader = readable.getReader();
    return new ReadableStream({
      async pull(controller) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        } catch (error) {
          await cancel(reader, error);
          throw mapCodecError(error, sourceErrors);
        }
      },
      cancel(reason) {
        return reader.cancel(reason);
      }
    });
  }
  var ERR_INVALID_UNCOMPRESSED_SIZE, ERR_INVALID_COMPRESSED_DATA, ERR_CODEC_OUT_OF_MEMORY, ERR_INVALID_CRC32, Z_MEM_ERROR_CODE, FORMAT_DEFLATE_RAW, FORMAT_DEFLATE64_RAW, FORMAT_GZIP, GZIP_HEADER_LENGTH, GZIP_TRAILER_LENGTH, GZIP_HEADER_BYTES, DeflateStream, GzipToRawDeflateStream, InflateStream, formatSupportByStream;
  var init_zip_entry_stream = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/zip-entry-stream.js"() {
      init_crc32();
      init_crc32_stream();
      init_aes_crypto_stream();
      init_zip_crypto_stream();
      init_common_crypto();
      init_constants();
      init_array();
      init_compatible_streams();
      init_error();
      init_codec_registry();
      ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
      ERR_INVALID_COMPRESSED_DATA = "Invalid compressed data";
      ERR_CODEC_OUT_OF_MEMORY = "Codec out of memory";
      ERR_INVALID_CRC32 = "Invalid CRC32";
      Z_MEM_ERROR_CODE = "Z_MEM_ERROR";
      FORMAT_DEFLATE_RAW = "deflate-raw";
      FORMAT_DEFLATE64_RAW = "deflate64-raw";
      FORMAT_GZIP = "gzip";
      GZIP_HEADER_LENGTH = 10;
      GZIP_TRAILER_LENGTH = 8;
      GZIP_HEADER_BYTES = [31, 139, 8];
      DeflateStream = class extends TransformStream {
        constructor(options, { chunkSize, CompressionStreamFallback, CompressionStream: CompressionStream2 }) {
          super({});
          const { compressed, encrypted, useCompressionStream, zipCrypto, computeCrc32, level, deflate64, format, compressionMethod, inputSize } = options;
          const stream = this;
          let crc32Stream, encryptionStream, gzipCrc32Stream;
          let readable = super.readable;
          const codecStreams2 = format && getCodecStreams(format);
          const GzipCompressionStream = getGzipCodecStream(useCompressionStream, CompressionStream2, CompressionStreamFallback);
          const useGzipCrc32 = computeCrc32 && compressed && !deflate64 && !codecStreams2 && (!encrypted || zipCrypto) && Boolean(GzipCompressionStream);
          if ((!encrypted || zipCrypto) && computeCrc32 && !useGzipCrc32) {
            crc32Stream = new Crc32Stream();
            readable = pipeThrough(readable, crc32Stream);
          }
          if (compressed) {
            if (codecStreams2) {
              readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams2.CompressionStream, format, { level, chunkSize, compressionMethod, uncompressedSize: inputSize }));
            } else if (useGzipCrc32) {
              gzipCrc32Stream = new GzipToRawDeflateStream();
              readable = pipeThroughBackpressured(readable, new GzipCompressionStream(FORMAT_GZIP, { level, chunkSize }));
              readable = pipeThrough(readable, gzipCrc32Stream);
            } else {
              try {
                readable = pipeThroughCompressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream2, CompressionStreamFallback);
              } catch (error) {
                if (!useCompressionStream && CompressionStreamFallback) {
                  throw mapMemoryError(error);
                }
                let gzipStream;
                try {
                  gzipStream = new CompressionStream2(FORMAT_GZIP);
                } catch {
                  throw mapMemoryError(error);
                }
                readable = pipeThroughBackpressured(readable, gzipStream);
                readable = pipeThrough(readable, new GzipToRawDeflateStream());
              }
            }
          }
          if (encrypted) {
            if (zipCrypto) {
              readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
            } else {
              encryptionStream = new AESEncryptionStream(options);
              readable = pipeThrough(readable, encryptionStream);
            }
          }
          setReadable(stream, readable, () => {
            if ((!encrypted || zipCrypto) && computeCrc32) {
              stream.crc32 = useGzipCrc32 ? gzipCrc32Stream.crc32 : new DataView(crc32Stream.value.buffer).getUint32(0);
            }
          });
        }
      };
      GzipToRawDeflateStream = class extends TransformStream {
        constructor() {
          let stream;
          let headerBytesLeft = GZIP_HEADER_LENGTH;
          let trailerCandidate = new Uint8Array(0);
          super({
            transform(chunk, controller) {
              if (headerBytesLeft) {
                const droppedLength = Math.min(headerBytesLeft, chunk.length);
                headerBytesLeft -= droppedLength;
                chunk = chunk.subarray(droppedLength);
                if (!chunk.length) {
                  return;
                }
              }
              const availableLength = trailerCandidate.length + chunk.length;
              if (availableLength <= GZIP_TRAILER_LENGTH) {
                trailerCandidate = concat(trailerCandidate, chunk);
                return;
              }
              const emitLength = availableLength - GZIP_TRAILER_LENGTH;
              const emittedFromTrailer = Math.min(emitLength, trailerCandidate.length);
              controller.enqueue(concat(
                trailerCandidate.subarray(0, emittedFromTrailer),
                chunk.subarray(0, emitLength - emittedFromTrailer)
              ));
              trailerCandidate = concat(
                trailerCandidate.subarray(emittedFromTrailer),
                chunk.subarray(emitLength - emittedFromTrailer)
              );
            },
            flush() {
              const dataView = getDataView(trailerCandidate);
              stream.crc32 = dataView.getUint32(0, true);
              stream.uncompressedSize = dataView.getUint32(4, true);
            }
          });
          stream = this;
        }
      };
      InflateStream = class extends TransformStream {
        constructor(options, { chunkSize, DecompressionStreamFallback, DecompressionStream: DecompressionStream2 }) {
          super({});
          const { zipCrypto, encrypted, checkCrc32, crc32, compressed, useCompressionStream, deflate64, format, compressionMethod, rawBitFlag, outputSize } = options;
          let crc32Stream, decryptionStream, gzipCrc32;
          let readable = super.readable;
          if (encrypted) {
            if (zipCrypto) {
              readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
            } else {
              decryptionStream = new AESDecryptionStream(options);
              readable = pipeThrough(readable, decryptionStream);
            }
          }
          if (compressed) {
            const sourceErrors = /* @__PURE__ */ new Set();
            const codecStreams2 = format && getCodecStreams(format);
            let gzipStream;
            if (codecStreams2) {
              readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams2.DecompressionStream, format, { chunkSize, compressionMethod, rawBitFlag, uncompressedSize: outputSize }), sourceErrors);
            } else {
              const GzipDecompressionStream = getGzipCodecStream(useCompressionStream, DecompressionStream2, DecompressionStreamFallback);
              if (checkCrc32 && !deflate64 && crc32 !== UNDEFINED_VALUE && outputSize !== UNDEFINED_VALUE && GzipDecompressionStream) {
                try {
                  gzipStream = new GzipDecompressionStream(FORMAT_GZIP, { chunkSize });
                } catch {
                  gzipStream = UNDEFINED_VALUE;
                }
              }
              if (!gzipStream) {
                try {
                  readable = pipeThroughCompressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream2, DecompressionStreamFallback, sourceErrors);
                } catch (error) {
                  if (deflate64 || outputSize === UNDEFINED_VALUE || !useCompressionStream && DecompressionStreamFallback) {
                    throw mapMemoryError(error);
                  }
                  try {
                    gzipStream = new DecompressionStream2(FORMAT_GZIP);
                  } catch {
                    throw mapMemoryError(error);
                  }
                }
              }
            }
            if (gzipStream) {
              gzipCrc32 = true;
              readable = pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, crc32, sourceErrors);
            } else {
              readable = mapInflateStreamError(readable, sourceErrors);
            }
          }
          if (checkCrc32 && !gzipCrc32) {
            crc32Stream = new Crc32Stream();
            readable = pipeThrough(readable, crc32Stream);
          }
          setReadable(this, readable, () => {
            if (crc32Stream) {
              const computedCrc32 = new DataView(crc32Stream.value.buffer).getUint32(0, false);
              if (crc32 != computedCrc32) {
                throw new Error(ERR_INVALID_CRC32);
              }
            }
          });
        }
      };
      formatSupportByStream = /* @__PURE__ */ new Map();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/codec-stream.js
  var DEFAULT_CHUNK_SIZE2, MESSAGE_EVENT_TYPE, MESSAGE_START, MESSAGE_PULL, MESSAGE_DATA, MESSAGE_ACK_DATA, MESSAGE_CLOSE, CODEC_DEFLATE, CODEC_INFLATE, CodecStream, ChunkStream;
  var init_codec_stream = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/streams/codec-stream.js"() {
      init_constants();
      init_zip_entry_stream();
      DEFAULT_CHUNK_SIZE2 = 64 * 1024;
      MESSAGE_EVENT_TYPE = "message";
      MESSAGE_START = "start";
      MESSAGE_PULL = "pull";
      MESSAGE_DATA = "data";
      MESSAGE_ACK_DATA = "ack";
      MESSAGE_CLOSE = "close";
      CODEC_DEFLATE = "deflate";
      CODEC_INFLATE = "inflate";
      CodecStream = class extends TransformStream {
        constructor(options, config2) {
          super({});
          const codec = this;
          const { codecType } = options;
          let Stream2;
          if (codecType.startsWith(CODEC_DEFLATE)) {
            Stream2 = DeflateStream;
          } else if (codecType.startsWith(CODEC_INFLATE)) {
            Stream2 = InflateStream;
          }
          codec.outputSize = 0;
          let inputSize = 0;
          const stream = new Stream2(options, config2);
          const readable = super.readable;
          const inputSizeStream = new TransformStream({
            transform(chunk, controller) {
              if (chunk && chunk.length) {
                inputSize += chunk.length;
                controller.enqueue(chunk);
              }
            },
            flush() {
              Object.assign(codec, {
                inputSize
              });
            }
          });
          const outputSizeStream = new TransformStream({
            transform(chunk, controller) {
              if (chunk && chunk.length) {
                controller.enqueue(chunk);
                codec.outputSize += chunk.length;
                if (options.outputSize !== UNDEFINED_VALUE && codec.outputSize > options.outputSize) {
                  throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
                }
              }
            },
            flush() {
              const { crc32 } = stream;
              Object.assign(codec, {
                crc32,
                inputSize
              });
            }
          });
          Object.defineProperty(codec, "readable", {
            get() {
              return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
            }
          });
        }
      };
      ChunkStream = class extends TransformStream {
        constructor(chunkSize) {
          const pendingChunks = [];
          let pendingLength = 0;
          let outputSize = 0;
          if (!Number.isFinite(chunkSize) || chunkSize < 1) {
            chunkSize = DEFAULT_CHUNK_SIZE2;
          }
          super({
            transform(chunk, controller) {
              pendingChunks.push(chunk);
              pendingLength += chunk.length;
              while (pendingLength > chunkSize) {
                outputSize += chunkSize;
                controller.enqueue(shiftChunk());
              }
            },
            flush(controller) {
              if (pendingLength) {
                outputSize += pendingLength;
                controller.enqueue(concatChunks(pendingChunks, pendingLength));
              }
            }
          });
          Object.defineProperty(this, "outputSize", {
            get: () => outputSize
          });
          function shiftChunk() {
            const result = new Uint8Array(chunkSize);
            let resultOffset = 0;
            while (resultOffset < chunkSize) {
              const firstChunk = pendingChunks[0];
              const remainingLength = chunkSize - resultOffset;
              if (firstChunk.length <= remainingLength) {
                result.set(firstChunk, resultOffset);
                resultOffset += firstChunk.length;
                pendingChunks.shift();
              } else {
                result.set(firstChunk.subarray(0, remainingLength), resultOffset);
                pendingChunks[0] = firstChunk.subarray(remainingLength);
                resultOffset += remainingLength;
              }
            }
            pendingLength -= chunkSize;
            return result;
          }
          function concatChunks(chunks, length) {
            const result = new Uint8Array(length);
            let offset = 0;
            for (const chunk of chunks) {
              result.set(chunk, offset);
              offset += chunk.length;
            }
            return result;
          }
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/codec-worker.js
  function setWebWorkerBackend(backend) {
    webWorkerBackend = backend;
  }
  async function supportsDeflate(config2) {
    const { CompressionStream: NativeStream, CompressionStreamFallback: FallbackStream } = config2;
    if (FallbackStream && !FallbackStream.requiresModule) {
      return true;
    }
    if (supportsDeflateRaw(NativeStream) || supportsGzip(NativeStream)) {
      return true;
    }
    if (FallbackStream) {
      return await loadModule(config2);
    }
    return false;
  }
  async function loadModule(config2) {
    if (initModule) {
      try {
        await initModule(config2);
        return true;
      } catch {
      }
    }
    return false;
  }
  function disableWebWorker(workerData) {
    if (workerData.createWorker) {
      createWorkerFailed = true;
    } else {
      webWorkerSupported = false;
    }
  }
  async function callHandler(handler, ...parameters) {
    try {
      await handler(...parameters);
    } catch {
    }
  }
  function createWorkerInterface(workerData, config2) {
    return {
      run: () => runWorker(workerData, config2)
    };
  }
  async function runWorker({ options, readable, writable, onTaskFinished, workerOptions }, config2) {
    let codecStream, chunkStream, modulePromise;
    try {
      if (options.compressed && !options.format) {
        const deflate = options.codecType.startsWith(CODEC_DEFLATE);
        const FallbackStream = deflate ? config2.CompressionStreamFallback : config2.DecompressionStreamFallback;
        const NativeStream = deflate ? config2.CompressionStream : config2.DecompressionStream;
        if (!options.useCompressionStream) {
          if (!await moduleLoaded() && (!FallbackStream || FallbackStream.requiresModule)) {
            options.useCompressionStream = true;
          }
        } else if (FallbackStream && FallbackStream.requiresModule && !supportsDeflateRaw(NativeStream)) {
          await moduleLoaded();
        }
      }
      if (options.encrypted && !options.zipCrypto) {
        await moduleLoaded();
      }
      codecStream = new CodecStream(options, config2);
      chunkStream = new ChunkStream(getChunkSize(config2));
      const { signal } = workerOptions.streamOptions;
      await readable.pipeThrough(codecStream).pipeThrough(chunkStream).pipeTo(writable, { preventClose: true, preventAbort: true, signal });
      const {
        crc32,
        inputSize,
        outputSize
      } = codecStream;
      return {
        crc32,
        inputSize,
        outputSize
      };
    } catch (error) {
      if (codecStream) {
        const outputSize = chunkStream ? chunkStream.outputSize : 0;
        workerOptions.outputSize = outputSize;
        if (isErrorObject(error)) {
          try {
            error.outputSize = outputSize;
          } catch {
          }
        }
      }
      throw error;
    } finally {
      onTaskFinished();
    }
    function moduleLoaded() {
      if (!modulePromise) {
        modulePromise = loadModule(config2);
      }
      return modulePromise;
    }
  }
  var ERR_WORKER_STARTUP_TIMEOUT, webWorkerSupported, createWorkerFailed, webWorkerBackend, initModule, CodecWorker, ProgressWatcherStream;
  var init_codec_worker = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/codec-worker.js"() {
      init_constants();
      init_configuration();
      init_error();
      init_codec_stream();
      ERR_WORKER_STARTUP_TIMEOUT = "Worker startup timeout";
      initModule = () => {
      };
      CodecWorker = class {
        constructor(workerData, { readable, writable }, workerOptions, onTaskFinished) {
          const { options, config: config2, streamOptions, useWebWorkers, transferStreams, workerURI } = workerOptions;
          let { createWorker } = workerOptions;
          const { signal } = streamOptions;
          if (createWorkerFailed) {
            createWorker = UNDEFINED_VALUE;
          }
          Object.assign(workerData, {
            busy: true,
            generation: (workerData.generation || 0) + 1,
            readable: readable.pipeThrough(new ChunkStream(getChunkSize(config2))).pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
            writable,
            options: Object.assign({}, options),
            workerOptions,
            workerURI,
            createWorker,
            transferStreams,
            terminate() {
              return new Promise((resolve) => {
                const { worker, busy } = workerData;
                if (busy) {
                  workerData.terminateResolvers = workerData.terminateResolvers || [];
                  workerData.terminateResolvers.push(resolve);
                } else {
                  if (worker) {
                    worker.terminate();
                    workerData.worker = null;
                  }
                  resolve();
                }
                workerData.interface = null;
              });
            },
            onTaskFinished() {
              if (workerData.busy) {
                const { terminateResolvers, worker } = workerData;
                if (terminateResolvers) {
                  workerData.terminateResolvers = null;
                  if (worker) {
                    workerData.terminated = true;
                    worker.terminate();
                  }
                }
                workerData.busy = false;
                const pendingTasks = onTaskFinished(workerData);
                if (terminateResolvers) {
                  terminateResolvers.forEach((resolve) => resolve(pendingTasks));
                }
              }
            }
          });
          if (webWorkerSupported === UNDEFINED_VALUE) {
            webWorkerSupported = typeof Worker != UNDEFINED_TYPE;
          }
          return (useWebWorkers && webWorkerBackend && (webWorkerSupported && workerURI || createWorker) ? webWorkerBackend : createWorkerInterface)(workerData, config2);
        }
      };
      ProgressWatcherStream = class extends TransformStream {
        constructor({ onstart, onprogress, size, onend }) {
          let chunkOffset = 0;
          super({
            async start() {
              if (onstart) {
                await callHandler(onstart, size);
              }
            },
            async transform(chunk, controller) {
              chunkOffset += chunk.length;
              if (onprogress) {
                await callHandler(onprogress, chunkOffset, size);
              }
              controller.enqueue(chunk);
            },
            async flush() {
              if (onend) {
                await callHandler(onend, chunkOffset);
              }
            }
          });
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/codec-pool.js
  async function runWorker2(stream, workerOptions) {
    const { options, config: config2 } = workerOptions;
    const { transferStreams, useWebWorkers, useCompressionStream, compressed, checkCrc32, computeCrc32, encrypted, format, codecURI } = options;
    const { workerURI, createWorker, maxWorkers: maxWorkers2 } = config2;
    if (format) {
      if (codecURI) {
        options.codecURI = resolveCodecURI(codecURI, config2.baseURI);
      }
      await ensureCodecStreams(format, options.codecURI);
    }
    workerOptions.transferStreams = !format && (transferStreams || transferStreams === UNDEFINED_VALUE && config2.transferStreams);
    const streamCopy = !compressed && !checkCrc32 && !computeCrc32 && !encrypted;
    const workerSupported = format === UNDEFINED_VALUE || Boolean(options.codecURI);
    workerOptions.useWebWorkers = !streamCopy && workerSupported && (useWebWorkers || useWebWorkers === UNDEFINED_VALUE && config2.useWebWorkers);
    workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : UNDEFINED_VALUE;
    workerOptions.createWorker = workerOptions.useWebWorkers && createWorker ? createWorker : UNDEFINED_VALUE;
    options.useCompressionStream = useCompressionStream || useCompressionStream === UNDEFINED_VALUE && config2.useCompressionStream;
    return (await getWorker()).run();
    async function getWorker() {
      const workerData = pool.find((workerData2) => !workerData2.busy);
      if (workerData) {
        clearTerminateTimeout(workerData);
        return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
      } else if (pool.length < maxWorkers2) {
        const workerData2 = { indexWorker };
        indexWorker++;
        pool.push(workerData2);
        return new CodecWorker(workerData2, stream, workerOptions, onTaskFinished);
      } else {
        return new Promise((resolve) => {
          pendingRequests.push({ resolve, stream, workerOptions });
          starvationDelay = config2.workerStarvationTimeout;
          armStarvationTimeout();
        });
      }
    }
    function onTaskFinished(workerData) {
      clearStarvationTimeout();
      if (workerData.terminated) {
        workerData.terminated = false;
        return runPendingRequestsInline();
      } else if (pendingRequests.length) {
        const [{ resolve, stream: stream2, workerOptions: workerOptions2 }] = pendingRequests.splice(0, 1);
        resolve(new CodecWorker(workerData, stream2, workerOptions2, onTaskFinished));
        armStarvationTimeout();
      } else if (workerData.worker) {
        clearTerminateTimeout(workerData);
        terminateWorker2(workerData, workerOptions);
      } else {
        pool = pool.filter((data) => data != workerData);
      }
    }
  }
  function resolveCodecURI(codecURI, baseURI) {
    try {
      return new URL(codecURI, baseURI).toString();
    } catch {
      return codecURI;
    }
  }
  function armStarvationTimeout() {
    if (!starvationTimeout && pendingRequests.length && Number.isFinite(starvationDelay) && starvationDelay >= 0) {
      starvationTimeout = setTimeout(onWorkerStarvation, starvationDelay);
    }
  }
  function clearStarvationTimeout() {
    if (starvationTimeout) {
      clearTimeout(starvationTimeout);
      starvationTimeout = null;
    }
  }
  function onWorkerStarvation() {
    starvationTimeout = null;
    if (pendingRequests.length) {
      const [{ resolve, stream, workerOptions }] = pendingRequests.splice(0, 1);
      resolve(new CodecWorker({}, stream, getInlineWorkerOptions(workerOptions), onInlineTaskFinished));
      armStarvationTimeout();
    }
  }
  function runPendingRequestsInline() {
    const tasks = pendingRequests.splice(0).map(({ resolve, stream, workerOptions }) => new Promise((resolveTask) => {
      resolve(new CodecWorker({}, stream, getInlineWorkerOptions(workerOptions), () => {
        onInlineTaskFinished();
        resolveTask();
      }));
    }));
    clearStarvationTimeout();
    return Promise.all(tasks);
  }
  function getInlineWorkerOptions(workerOptions) {
    return Object.assign({}, workerOptions, { useWebWorkers: false, workerURI: UNDEFINED_VALUE, createWorker: UNDEFINED_VALUE });
  }
  function onInlineTaskFinished() {
    clearStarvationTimeout();
    armStarvationTimeout();
  }
  function terminateWorker2(workerData, workerOptions) {
    const { config: config2 } = workerOptions;
    const { terminateWorkerTimeout } = config2;
    if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) {
      workerData.terminateTimeout = setTimeout(async () => {
        pool = pool.filter((data) => data != workerData);
        try {
          await workerData.terminate();
        } catch {
        }
      }, terminateWorkerTimeout);
    }
  }
  function clearTerminateTimeout(workerData) {
    const { terminateTimeout } = workerData;
    if (terminateTimeout) {
      clearTimeout(terminateTimeout);
      workerData.terminateTimeout = null;
    }
  }
  var pool, pendingRequests, starvationTimeout, starvationDelay, indexWorker;
  var init_codec_pool = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/codec-pool.js"() {
      init_constants();
      init_codec_stream();
      init_codec_registry();
      init_codec_worker();
      pool = [];
      pendingRequests = [];
      indexWorker = 0;
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/decode-cp437.js
  function decodeCP437(stringValue) {
    let result = "";
    for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
      result += CP437[stringValue[indexCharacter]];
    }
    return result;
  }
  var CP437;
  var init_decode_cp437 = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/decode-cp437.js"() {
      CP437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0".split("");
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/decode-text.js
  function decodeText(value, encoding) {
    return decode(value, encoding, true);
  }
  function isUTF8Text(value) {
    if (value.some((byte) => byte > 127)) {
      try {
        new TextDecoder("utf-8", { fatal: true }).decode(value);
        return true;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }
  function decode(value, encoding, ignoreBOM) {
    if (encoding && encoding.trim().toLowerCase() == "cp437") {
      return decodeCP437(value);
    } else {
      return new TextDecoder(encoding, { ignoreBOM }).decode(value);
    }
  }
  var init_decode_text = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/decode-text.js"() {
      init_decode_cp437();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/io.js
  function probeBlobSliceReliability() {
    blobSliceProbe = (async () => {
      try {
        const slicedBlob = new Blob([new Uint8Array(3)]).slice(1, 2);
        const streamReader = slicedBlob.stream().getReader();
        let streamedLength = 0;
        let result = await streamReader.read();
        while (!result.done) {
          streamedLength += result.value.length;
          result = await streamReader.read();
        }
        blobSliceReliable = streamedLength == 1;
      } catch {
        blobSliceReliable = false;
      }
    })();
  }
  function ownsWritable(writer) {
    return Boolean(writer && writer.getData);
  }
  async function initStream(stream, initSize) {
    if (stream.init && !stream.initialized) {
      await stream.init(initSize);
    } else {
      return Promise.resolve();
    }
  }
  async function initDiskReader(diskReader) {
    diskReader = new GenericReader(diskReader);
    await initStream(diskReader);
    if (diskReader.size === UNDEFINED_VALUE || !diskReader.readUint8Array) {
      diskReader = new BlobReader(await streamToBlob(diskReader.readable));
      await initStream(diskReader);
    }
    return diskReader;
  }
  function readUint8Array(reader, offset, size) {
    return reader.readUint8Array(offset, size);
  }
  function createReadable(reader, options) {
    if (reader.createReadable) {
      return reader.createReadable(options);
    } else if (reader.readUint8Array) {
      return Reader.prototype.createReadable.call(reader, options);
    } else {
      return reader.readable;
    }
  }
  var ERR_ITERATOR_COMPLETED_TOO_SOON, ERR_WRITER_SIZE_NOT_WRITABLE, DEFAULT_BUFFER_SIZE, DEFAULT_MAXIMUM_RANGE_SIZE, END_OF_CENTRAL_DIR_SEARCH_LENGTH, PROPERTY_NAME_WRITABLE, DISK_BOUNDARY, Stream, Reader, blobSliceReliable, blobSliceProbe, BlobReader, BlobWriter, SplitDataReader, SplitDataWriter, GenericReader, GenericWriter;
  var init_io = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/io.js"() {
      init_constants();
      init_configuration();
      init_array();
      init_compatible_streams();
      init_decode_text();
      ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
      ERR_WRITER_SIZE_NOT_WRITABLE = "Invalid writer (size must be writable)";
      DEFAULT_BUFFER_SIZE = 256 * 1024;
      DEFAULT_MAXIMUM_RANGE_SIZE = 16 * 1024 * 1024;
      END_OF_CENTRAL_DIR_SEARCH_LENGTH = END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS;
      PROPERTY_NAME_WRITABLE = "writable";
      DISK_BOUNDARY = Symbol();
      Stream = class {
        constructor() {
          this.size = 0;
        }
        init() {
          this.initialized = true;
        }
      };
      Reader = class extends Stream {
        get readable() {
          return this.createReadable();
        }
        createReadable({ offset = 0, size, chunkSize = getChunkSize(getConfiguration()) } = {}) {
          const reader = this;
          let chunkOffset = 0;
          chunkSize = normalizeChunkSize(chunkSize);
          return new ReadableStream({
            async pull(controller) {
              const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
              const data = await readUint8Array(reader, offset + chunkOffset, dataSize);
              if (data.length) {
                controller.enqueue(data);
                chunkOffset += data.length;
              }
              if (size !== UNDEFINED_VALUE && chunkOffset >= size || !data.length && dataSize) {
                controller.close();
              }
            }
          });
        }
      };
      BlobReader = class extends Reader {
        constructor(blob) {
          super();
          Object.assign(this, {
            sourceBlob: blob,
            size: blob.size
          });
          if (!blobSliceProbe) {
            probeBlobSliceReliability();
          }
        }
        createReadable(options) {
          const reader = this;
          const { sourceBlob, size } = reader;
          const { offset = 0, size: readSize = size - offset } = options || {};
          if (typeof sourceBlob.stream == FUNCTION_TYPE) {
            if (!offset && readSize >= size) {
              return toCompatibleReadable(sourceBlob.stream());
            }
            if (blobSliceReliable) {
              return toCompatibleReadable(sourceBlob.slice(offset, offset + readSize).stream());
            }
          }
          return super.createReadable(options);
        }
        async readUint8Array(offset, length) {
          const reader = this;
          const offsetEnd = offset + length;
          const readsWholeBlob = !offset && offsetEnd >= reader.size;
          const blob = readsWholeBlob ? reader.sourceBlob : reader.sourceBlob.slice(offset, offsetEnd);
          let arrayBuffer = await blob.arrayBuffer();
          const sliceIgnoredByBuggyImplementation = arrayBuffer.byteLength > length;
          if (sliceIgnoredByBuggyImplementation) {
            arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
          }
          return new Uint8Array(arrayBuffer);
        }
      };
      BlobWriter = class extends Stream {
        constructor(contentType) {
          super();
          const writer = this;
          const transformStream = new TransformStream();
          Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
            get() {
              return transformStream.writable;
            }
          });
          writer.contentType = contentType;
          writer.blobPromise = streamToBlob(transformStream.readable, contentType);
          writer.blobPromise.catch(() => {
          });
        }
        getData() {
          return this.blobPromise;
        }
      };
      SplitDataReader = class extends Reader {
        constructor(readers) {
          super();
          this.readers = readers;
        }
        async init() {
          const reader = this;
          reader.lastDiskNumber = 0;
          const readers = reader.readers = await Promise.all(reader.readers.map(initDiskReader));
          reader.diskOffsets = readers.map((diskReader) => {
            const diskOffset = reader.size;
            reader.size += diskReader.size;
            return diskOffset;
          });
          super.init();
        }
        getDiskOffset(diskNumber) {
          const { diskOffsets, size } = this;
          const diskOffset = diskOffsets[diskNumber];
          return diskOffset === UNDEFINED_VALUE ? size : diskOffset;
        }
        async readUint8Array(offset, length) {
          const reader = this;
          const { readers } = this;
          let result;
          let currentDiskNumber = 0;
          let currentReaderOffset = offset;
          while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
            currentReaderOffset -= readers[currentDiskNumber].size;
            currentDiskNumber++;
          }
          const currentReader = readers[currentDiskNumber];
          if (currentReader) {
            const currentReaderSize = currentReader.size;
            if (currentReaderOffset + length <= currentReaderSize) {
              result = await readUint8Array(currentReader, currentReaderOffset, length);
            } else {
              const chunkLength = currentReaderSize - currentReaderOffset;
              const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
              const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength);
              result = concat(firstPart, secondPart);
            }
          } else {
            result = EMPTY_UINT8_ARRAY;
          }
          reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
          return result;
        }
      };
      SplitDataWriter = class extends Stream {
        constructor(writerGenerator, maxSize = 4294967295) {
          super();
          const writer = this;
          Object.assign(writer, {
            diskNumber: 0,
            diskOffset: 0,
            size: 0,
            maxSize,
            availableSize: maxSize
          });
          let diskSourceWriter, diskWritable, diskWriter;
          const writable = new WritableStream({
            async write(chunk) {
              if (chunk === DISK_BOUNDARY) {
                if (diskWriter) {
                  await endDisk();
                }
                return;
              }
              const { availableSize } = writer;
              if (!diskWriter) {
                const { value, done } = await writerGenerator.next();
                if (done && !value) {
                  throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
                } else {
                  diskSourceWriter = value;
                  diskSourceWriter.size = 0;
                  if (diskSourceWriter.maxSize) {
                    writer.maxSize = diskSourceWriter.maxSize;
                  }
                  writer.availableSize = writer.maxSize;
                  await initStream(diskSourceWriter);
                  diskWritable = value.writable;
                  diskWriter = diskWritable.getWriter();
                }
                await this.write(chunk);
              } else if (chunk.length >= availableSize) {
                await writeChunk(chunk.subarray(0, availableSize));
                await endDisk();
                if (chunk.length > availableSize) {
                  await this.write(chunk.subarray(availableSize));
                }
              } else {
                await writeChunk(chunk);
              }
            },
            async close() {
              if (diskWriter) {
                await diskWriter.ready;
                await closeDiskWriter();
              }
            },
            async abort(reason) {
              if (diskWriter) {
                await diskWriter.abort(reason);
              }
            }
          });
          Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
            get() {
              return writable;
            }
          });
          async function writeChunk(chunk) {
            const chunkLength = chunk.length;
            if (chunkLength) {
              await diskWriter.ready;
              await diskWriter.write(chunk);
              diskSourceWriter.size += chunkLength;
              writer.availableSize -= chunkLength;
            }
          }
          async function endDisk() {
            await closeDiskWriter();
            writer.diskOffset += diskSourceWriter.size;
            writer.diskNumber++;
            diskWriter = null;
            writer.availableSize = writer.maxSize;
          }
          async function closeDiskWriter() {
            await diskWriter.close();
          }
        }
        async closeDisk() {
          const streamWriter = this.writable.getWriter();
          try {
            await streamWriter.ready;
            await streamWriter.write(DISK_BOUNDARY);
          } finally {
            streamWriter.releaseLock();
          }
        }
      };
      GenericReader = class {
        constructor(reader) {
          if (Array.isArray(reader)) {
            reader = new SplitDataReader(reader);
          }
          if (reader instanceof ReadableStream || typeof reader.getReader == FUNCTION_TYPE) {
            reader = {
              readable: toCompatibleReadable(reader)
            };
          }
          return reader;
        }
      };
      GenericWriter = class {
        constructor(writer) {
          if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
            writer = new SplitDataWriter(writer);
          }
          if (writer instanceof WritableStream || typeof writer.getWriter == FUNCTION_TYPE) {
            writer = {
              writable: toCompatibleWritable(writer)
            };
          }
          try {
            writer.size = writer.size === UNDEFINED_VALUE ? 0 : writer.size;
          } catch {
            throw new Error(ERR_WRITER_SIZE_NOT_WRITABLE);
          }
          return writer;
        }
      };
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/util/warnings.js
  function addWarning(warnings, reason, filename) {
    if (!warnings.some((warning) => warning.reason == reason)) {
      const warning = { reason };
      if (filename !== UNDEFINED_VALUE) {
        warning.filename = filename;
      }
      warnings.push(warning);
    }
  }
  var init_warnings = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/util/warnings.js"() {
      init_constants();
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/zip-entry.js
  function getUserExtraField(extraField) {
    if (extraField) {
      const userExtraField = /* @__PURE__ */ new Map();
      extraField.forEach((field, type) => {
        if (!INTERPRETED_EXTRA_FIELD_TYPES.has(type)) {
          userExtraField.set(type, field.data);
        }
      });
      if (userExtraField.size) {
        return userExtraField;
      }
    }
  }
  function getEncryptionOverhead(encrypted, zipCrypto, encryptionStrength) {
    return encrypted ? zipCrypto ? 12 : 16 + encryptionStrength * 4 : 0;
  }
  var PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, PROPERTY_NAME_UNCOMPRESSED_SIZE, PROPERTY_NAME_COMPRESSED_SIZE, PROPERTY_NAME_OFFSET, PROPERTY_NAME_DISK_NUMBER_START, PROPERTY_NAME_LAST_MODIFICATION_DATE, PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE, PROPERTY_NAME_LAST_ACCESS_DATE, PROPERTY_NAME_RAW_LAST_ACCESS_DATE, PROPERTY_NAME_CREATION_DATE, PROPERTY_NAME_RAW_CREATION_DATE, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW, PROPERTY_NAME_MSDOS_ATTRIBUTES, PROPERTY_NAME_MS_DOS_COMPATIBLE, PROPERTY_NAME_ZIP64, PROPERTY_NAME_ENCRYPTED, PROPERTY_NAME_VERSION, PROPERTY_NAME_VERSION_MADE_BY, PROPERTY_NAME_ZIPCRYPTO, PROPERTY_NAME_DIRECTORY, PROPERTY_NAME_EXECUTABLE, PROPERTY_NAME_SYMLINK, PROPERTY_NAME_COMPRESSION_METHOD, PROPERTY_NAME_SIGNATURE, PROPERTY_NAME_CRC32, PROPERTY_NAME_EXTRA_FIELD, PROPERTY_NAME_EXTRA_FIELD_INFOZIP, PROPERTY_NAME_EXTRA_FIELD_UNIX, PROPERTY_NAME_EXTRA_FIELD_UNIX_TYPE1, PROPERTY_NAME_EXTRA_FIELD_PKWARE_UNIX, PROPERTY_NAME_UID, PROPERTY_NAME_GID, PROPERTY_NAME_UNIX_MODE, PROPERTY_NAME_SETUID, PROPERTY_NAME_SETGID, PROPERTY_NAME_STICKY, PROPERTY_NAME_BITFLAG, PROPERTY_NAME_RAW_BITFLAG, PROPERTY_NAME_FILENAME_LENGTH, PROPERTY_NAME_EXTRA_FIELD_LENGTH, PROPERTY_NAME_UNIX_EXTERNAL_UPPER, PROPERTY_NAME_FILENAME_UTF8, PROPERTY_NAME_COMMENT_UTF8, PROPERTY_NAME_RAW_EXTRA_FIELD, PROPERTY_NAME_EXTRA_FIELD_ZIP64, PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH, PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT, PROPERTY_NAME_EXTRA_FIELD_AES, PROPERTY_NAME_EXTRA_FIELD_NTFS, PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP, PROPERTY_NAME_EXTRA_FIELD_USDZ, PROPERTY_NAMES, Entry, INTERPRETED_EXTRA_FIELD_TYPES;
  var init_zip_entry = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/zip-entry.js"() {
      init_constants();
      PROPERTY_NAME_FILENAME = "filename";
      PROPERTY_NAME_RAW_FILENAME = "rawFilename";
      PROPERTY_NAME_COMMENT = "comment";
      PROPERTY_NAME_RAW_COMMENT = "rawComment";
      PROPERTY_NAME_UNCOMPRESSED_SIZE = "uncompressedSize";
      PROPERTY_NAME_COMPRESSED_SIZE = "compressedSize";
      PROPERTY_NAME_OFFSET = "offset";
      PROPERTY_NAME_DISK_NUMBER_START = "diskNumberStart";
      PROPERTY_NAME_LAST_MODIFICATION_DATE = "lastModDate";
      PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE = "rawLastModDate";
      PROPERTY_NAME_LAST_ACCESS_DATE = "lastAccessDate";
      PROPERTY_NAME_RAW_LAST_ACCESS_DATE = "rawLastAccessDate";
      PROPERTY_NAME_CREATION_DATE = "creationDate";
      PROPERTY_NAME_RAW_CREATION_DATE = "rawCreationDate";
      PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES = "internalFileAttributes";
      PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttributes";
      PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW = "msdosAttributesRaw";
      PROPERTY_NAME_MSDOS_ATTRIBUTES = "msdosAttributes";
      PROPERTY_NAME_MS_DOS_COMPATIBLE = "msDosCompatible";
      PROPERTY_NAME_ZIP64 = "zip64";
      PROPERTY_NAME_ENCRYPTED = "encrypted";
      PROPERTY_NAME_VERSION = "version";
      PROPERTY_NAME_VERSION_MADE_BY = "versionMadeBy";
      PROPERTY_NAME_ZIPCRYPTO = "zipCrypto";
      PROPERTY_NAME_DIRECTORY = "directory";
      PROPERTY_NAME_EXECUTABLE = "executable";
      PROPERTY_NAME_SYMLINK = "symlink";
      PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
      PROPERTY_NAME_SIGNATURE = "signature";
      PROPERTY_NAME_CRC32 = "crc32";
      PROPERTY_NAME_EXTRA_FIELD = "extraField";
      PROPERTY_NAME_EXTRA_FIELD_INFOZIP = "extraFieldInfoZip";
      PROPERTY_NAME_EXTRA_FIELD_UNIX = "extraFieldUnix";
      PROPERTY_NAME_EXTRA_FIELD_UNIX_TYPE1 = "extraFieldUnixType1";
      PROPERTY_NAME_EXTRA_FIELD_PKWARE_UNIX = "extraFieldPkwareUnix";
      PROPERTY_NAME_UID = "uid";
      PROPERTY_NAME_GID = "gid";
      PROPERTY_NAME_UNIX_MODE = "unixMode";
      PROPERTY_NAME_SETUID = "setuid";
      PROPERTY_NAME_SETGID = "setgid";
      PROPERTY_NAME_STICKY = "sticky";
      PROPERTY_NAME_BITFLAG = "bitFlag";
      PROPERTY_NAME_RAW_BITFLAG = "rawBitFlag";
      PROPERTY_NAME_FILENAME_LENGTH = "filenameLength";
      PROPERTY_NAME_EXTRA_FIELD_LENGTH = "extraFieldLength";
      PROPERTY_NAME_UNIX_EXTERNAL_UPPER = "unixExternalUpper";
      PROPERTY_NAME_FILENAME_UTF8 = "filenameUTF8";
      PROPERTY_NAME_COMMENT_UTF8 = "commentUTF8";
      PROPERTY_NAME_RAW_EXTRA_FIELD = "rawExtraField";
      PROPERTY_NAME_EXTRA_FIELD_ZIP64 = "extraFieldZip64";
      PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH = "extraFieldUnicodePath";
      PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT = "extraFieldUnicodeComment";
      PROPERTY_NAME_EXTRA_FIELD_AES = "extraFieldAES";
      PROPERTY_NAME_EXTRA_FIELD_NTFS = "extraFieldNTFS";
      PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP = "extraFieldExtendedTimestamp";
      PROPERTY_NAME_EXTRA_FIELD_USDZ = "extraFieldUSDZ";
      PROPERTY_NAMES = [
        PROPERTY_NAME_FILENAME,
        PROPERTY_NAME_RAW_FILENAME,
        PROPERTY_NAME_UNCOMPRESSED_SIZE,
        PROPERTY_NAME_COMPRESSED_SIZE,
        PROPERTY_NAME_LAST_MODIFICATION_DATE,
        PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
        PROPERTY_NAME_COMMENT,
        PROPERTY_NAME_RAW_COMMENT,
        PROPERTY_NAME_LAST_ACCESS_DATE,
        PROPERTY_NAME_RAW_LAST_ACCESS_DATE,
        PROPERTY_NAME_CREATION_DATE,
        PROPERTY_NAME_RAW_CREATION_DATE,
        PROPERTY_NAME_OFFSET,
        PROPERTY_NAME_DISK_NUMBER_START,
        PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
        PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
        PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW,
        PROPERTY_NAME_MSDOS_ATTRIBUTES,
        PROPERTY_NAME_MS_DOS_COMPATIBLE,
        PROPERTY_NAME_ZIP64,
        PROPERTY_NAME_ENCRYPTED,
        PROPERTY_NAME_VERSION,
        PROPERTY_NAME_VERSION_MADE_BY,
        PROPERTY_NAME_ZIPCRYPTO,
        PROPERTY_NAME_DIRECTORY,
        PROPERTY_NAME_EXECUTABLE,
        PROPERTY_NAME_SYMLINK,
        PROPERTY_NAME_COMPRESSION_METHOD,
        PROPERTY_NAME_SIGNATURE,
        PROPERTY_NAME_CRC32,
        PROPERTY_NAME_EXTRA_FIELD,
        PROPERTY_NAME_EXTRA_FIELD_UNIX,
        PROPERTY_NAME_EXTRA_FIELD_INFOZIP,
        PROPERTY_NAME_EXTRA_FIELD_UNIX_TYPE1,
        PROPERTY_NAME_EXTRA_FIELD_PKWARE_UNIX,
        PROPERTY_NAME_UID,
        PROPERTY_NAME_GID,
        PROPERTY_NAME_UNIX_MODE,
        PROPERTY_NAME_UNIX_EXTERNAL_UPPER,
        PROPERTY_NAME_SETUID,
        PROPERTY_NAME_SETGID,
        PROPERTY_NAME_STICKY,
        PROPERTY_NAME_BITFLAG,
        PROPERTY_NAME_RAW_BITFLAG,
        PROPERTY_NAME_FILENAME_LENGTH,
        PROPERTY_NAME_EXTRA_FIELD_LENGTH,
        PROPERTY_NAME_FILENAME_UTF8,
        PROPERTY_NAME_COMMENT_UTF8,
        PROPERTY_NAME_RAW_EXTRA_FIELD,
        PROPERTY_NAME_EXTRA_FIELD_ZIP64,
        PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH,
        PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT,
        PROPERTY_NAME_EXTRA_FIELD_AES,
        PROPERTY_NAME_EXTRA_FIELD_NTFS,
        PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP,
        PROPERTY_NAME_EXTRA_FIELD_USDZ
      ];
      Entry = class {
        constructor(data) {
          PROPERTY_NAMES.forEach((name) => this[name] = data[name]);
        }
      };
      INTERPRETED_EXTRA_FIELD_TYPES = /* @__PURE__ */ new Set([
        EXTRAFIELD_TYPE_ZIP64,
        EXTRAFIELD_TYPE_AES,
        EXTRAFIELD_TYPE_NTFS,
        EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
        EXTRAFIELD_TYPE_UNICODE_PATH,
        EXTRAFIELD_TYPE_UNICODE_COMMENT,
        EXTRAFIELD_TYPE_USDZ,
        EXTRAFIELD_TYPE_INFOZIP,
        EXTRAFIELD_TYPE_UNIX,
        EXTRAFIELD_TYPE_UNIX_TYPE1,
        EXTRAFIELD_TYPE_PKWARE_UNIX
      ]);
    }
  });

  // ../../node_modules/@zip.js/zip.js/lib/core/zip-reader.js
  var zip_reader_exports = {};
  __export(zip_reader_exports, {
    ERR_AMBIGUOUS_ARCHIVE: () => ERR_AMBIGUOUS_ARCHIVE,
    ERR_BAD_FORMAT: () => ERR_BAD_FORMAT,
    ERR_CENTRAL_DIRECTORY_NOT_FOUND: () => ERR_CENTRAL_DIRECTORY_NOT_FOUND,
    ERR_CODEC_OUT_OF_MEMORY: () => ERR_CODEC_OUT_OF_MEMORY,
    ERR_ENCRYPTED: () => ERR_ENCRYPTED,
    ERR_ENCRYPTED_CENTRAL_DIRECTORY: () => ERR_ENCRYPTED_CENTRAL_DIRECTORY,
    ERR_ENTRY_DATA_OUT_OF_BOUNDS: () => ERR_ENTRY_DATA_OUT_OF_BOUNDS,
    ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: () => ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
    ERR_EOCDR_NOT_FOUND: () => ERR_EOCDR_NOT_FOUND,
    ERR_EXTRAFIELD_ZIP64_NOT_FOUND: () => ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
    ERR_INVALID_AUTHENTICATION_CODE: () => ERR_INVALID_AUTHENTICATION_CODE,
    ERR_INVALID_COMPRESSED_DATA: () => ERR_INVALID_COMPRESSED_DATA,
    ERR_INVALID_CRC32: () => ERR_INVALID_CRC32,
    ERR_INVALID_FILENAME_VALIDATION: () => ERR_INVALID_FILENAME_VALIDATION,
    ERR_INVALID_MAX_APPENDED_DATA_SIZE: () => ERR_INVALID_MAX_APPENDED_DATA_SIZE,
    ERR_INVALID_PASSWORD: () => ERR_INVALID_PASSWORD,
    ERR_INVALID_STRICTNESS: () => ERR_INVALID_STRICTNESS,
    ERR_INVALID_UNCOMPRESSED_SIZE: () => ERR_INVALID_UNCOMPRESSED_SIZE,
    ERR_LOCAL_FILE_HEADER_NOT_FOUND: () => ERR_LOCAL_FILE_HEADER_NOT_FOUND,
    ERR_OVERLAPPING_ENTRY: () => ERR_OVERLAPPING_ENTRY,
    ERR_SPLIT_ZIP_FILE: () => ERR_SPLIT_ZIP_FILE,
    ERR_UNSAFE_FILENAME: () => ERR_UNSAFE_FILENAME,
    ERR_UNSUPPORTED_COMPRESSION: () => ERR_UNSUPPORTED_COMPRESSION,
    ERR_UNSUPPORTED_ENCRYPTION: () => ERR_UNSUPPORTED_ENCRYPTION,
    ERR_UNSUPPORTED_UINT64: () => ERR_UNSUPPORTED_UINT64,
    ERR_WORKER_STARTUP_TIMEOUT: () => ERR_WORKER_STARTUP_TIMEOUT,
    WARNING_APPENDED_DATA: () => WARNING_APPENDED_DATA,
    WARNING_COMPRESSED_PATCHED_DATA: () => WARNING_COMPRESSED_PATCHED_DATA,
    WARNING_DUPLICATE_FILENAME: () => WARNING_DUPLICATE_FILENAME,
    WARNING_MALFORMED_EXTRA_FIELD: () => WARNING_MALFORMED_EXTRA_FIELD,
    WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG: () => WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG,
    WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD: () => WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD,
    WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES: () => WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES,
    WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME: () => WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME,
    WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY: () => WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY,
    WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY: () => WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY,
    WARNING_PREPENDED_CENTRAL_DIRECTORY: () => WARNING_PREPENDED_CENTRAL_DIRECTORY,
    WARNING_PREPENDED_DATA: () => WARNING_PREPENDED_DATA,
    WARNING_TRAILING_CENTRAL_DIRECTORY_DATA: () => WARNING_TRAILING_CENTRAL_DIRECTORY_DATA,
    WARNING_UNKNOWN_VERSION: () => WARNING_UNKNOWN_VERSION,
    WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA: () => WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA,
    WARNING_UNSORTED_CENTRAL_DIRECTORY: () => WARNING_UNSORTED_CENTRAL_DIRECTORY,
    WARNING_WRAPPED_ENTRIES_COUNT: () => WARNING_WRAPPED_ENTRIES_COUNT,
    ZipReader: () => ZipReader,
    ZipReaderStream: () => ZipReaderStream,
    isZipFile: () => isZipFile
  });
  function createEntryStream(entry, pendingEntries2) {
    const { readable, writable } = new TransformStream();
    let dataReader;
    const entryStream = {
      cancel: async (reason) => {
        pendingEntries2.delete(entryStream);
        await (dataReader ? dataReader.cancel(reason) : readable.cancel(reason));
      }
    };
    entryStream.readable = new ReadableStream({
      async pull(controller) {
        if (!dataReader) {
          dataReader = readable.getReader();
          pendingEntries2.add(entryStream);
          getData();
        }
        const { done, value } = await dataReader.read();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      cancel: (reason) => entryStream.cancel(reason)
    }, { highWaterMark: 0 });
    return entryStream;
    async function getData() {
      try {
        await entry.getData(writable, { preventClose: false });
      } catch (error) {
        try {
          await writable.abort(error);
        } catch {
        }
      } finally {
        pendingEntries2.delete(entryStream);
      }
    }
  }
  async function isZipFile(reader, options = {}) {
    reader = new GenericReader(reader);
    await initStream(reader);
    if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
      reader = new BlobReader(await streamToBlob(reader.readable));
      await initStream(reader);
    }
    if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
      return false;
    }
    const strictness = getStrictness(options, {});
    const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
    const maxAppendedDataSize = getMaxAppendedDataSize(options[OPTION_MAX_APPENDED_DATA_SIZE], strictness);
    const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
    if (!endOfDirectoryInfo || strictness == STRICTNESS_STRICT && endOfDirectoryReachingEndCount > 1) {
      return false;
    }
    const commentLength = getUint16(getDataView(endOfDirectoryInfo), 20);
    const appendedDataOffset = endOfDirectoryInfo.offset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
    return reader.size - appendedDataOffset <= maxAppendedDataSize;
  }
  function detectEncryptedCentralDirectory(directoryView) {
    const maxOffset = Math.min(directoryView.byteLength, 1024) - 3;
    for (let offset = 0; offset < maxOffset; offset++) {
      if (getUint32(directoryView, offset) == ARCHIVE_EXTRA_DATA_SIGNATURE) {
        return true;
      }
    }
    return false;
  }
  function getWrappedFilesLength(directoryView, directoryArray, offset) {
    let wrappedFilesLength = 0;
    while (offset + CENTRAL_FILE_HEADER_LENGTH <= directoryArray.length && getUint32(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE) {
      offset += CENTRAL_FILE_HEADER_LENGTH + getUint16(directoryView, offset + 28) + getUint16(directoryView, offset + 30) + getUint16(directoryView, offset + 32);
      wrappedFilesLength++;
    }
    return wrappedFilesLength % (MAX_16_BITS + 1) ? 0 : wrappedFilesLength;
  }
  function readDigitalSignature(signatureRecordArray) {
    if (signatureRecordArray.length >= 6) {
      const signatureRecordView = getDataView(signatureRecordArray);
      if (getUint32(signatureRecordView, 0) == DIGITAL_SIGNATURE_RECORD_SIGNATURE) {
        const signatureDataLength = getUint16(signatureRecordView, 4);
        if (6 + signatureDataLength <= signatureRecordArray.length) {
          return new Uint8Array(signatureRecordArray.subarray(6, 6 + signatureDataLength));
        }
      }
    }
  }
  function getEncryptedDirectoryDataLength(directoryEncryptionInfo, declaredDirectoryDataLength, directoryDataLength) {
    const encryptedDirectoryDataLength = directoryEncryptionInfo && directoryEncryptionInfo.compressedSize ? directoryEncryptionInfo.compressedSize : declaredDirectoryDataLength;
    return encryptedDirectoryDataLength > 0 && encryptedDirectoryDataLength <= directoryDataLength ? encryptedDirectoryDataLength : directoryDataLength;
  }
  function getDirectoryEncryptionInfo(rawExtensibleData) {
    const directoryEncryptionInfo = { rawExtensibleData };
    if (rawExtensibleData.length >= 28) {
      const extensibleDataView = getDataView(rawExtensibleData);
      const hashDataLength = getUint16(extensibleDataView, 26);
      Object.assign(directoryEncryptionInfo, {
        compressionMethod: getUint16(extensibleDataView, 0),
        compressedSize: getBigUint64(extensibleDataView, 2),
        uncompressedSize: getBigUint64(extensibleDataView, 10),
        encryptionAlgorithm: getUint16(extensibleDataView, 18),
        bitLength: getUint16(extensibleDataView, 20),
        flags: getUint16(extensibleDataView, 22),
        hashAlgorithm: getUint16(extensibleDataView, 24),
        hashData: rawExtensibleData.subarray(28, 28 + hashDataLength)
      });
    }
    return directoryEncryptionInfo;
  }
  function readCommonHeader(directory, dataView, offset) {
    const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
    const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
    const rawLastModDate = getUint32(dataView, offset + 6);
    Object.assign(directory, {
      encrypted,
      version: getUint16(dataView, offset),
      bitFlag: {
        level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
        dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
        languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
      },
      rawLastModDate,
      lastModDate: getDate(rawLastModDate),
      filenameLength: getUint16(dataView, offset + 22),
      extraFieldLength: getUint16(dataView, offset + 24)
    });
  }
  function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
    const { rawExtraField } = directory;
    const extraField = directory.extraField = /* @__PURE__ */ new Map();
    const rawExtraFieldView = getDataView(rawExtraField);
    let offsetExtraField = 0;
    let malformedExtraField = false;
    try {
      while (offsetExtraField < rawExtraField.length) {
        const type = getUint16(rawExtraFieldView, offsetExtraField);
        const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
        extraField.set(type, {
          type,
          data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
        });
        offsetExtraField += 4 + size;
      }
    } catch {
      malformedExtraField = true;
    }
    if (offsetExtraField > rawExtraField.length) {
      malformedExtraField = true;
    }
    const compressionMethod = getUint16(dataView, offset + 4);
    Object.assign(directory, {
      signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
      crc32: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
      compressedSize: getUint32(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
      uncompressedSize: getUint32(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
    });
    const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
    if (extraFieldZip64) {
      if (!readExtraFieldZip64(extraFieldZip64, directory, localDirectory)) {
        malformedExtraField = true;
      }
      directory.extraFieldZip64 = extraFieldZip64;
    } else if (ZIP64_PROPERTIES.some(([propertyName, max]) => directory[propertyName] == max)) {
      if (localDirectory) {
        malformedExtraField = true;
      } else {
        throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
      }
    }
    const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
    if (extraFieldUnicodePath) {
      readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
      directory.extraFieldUnicodePath = extraFieldUnicodePath;
    }
    const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
    if (extraFieldUnicodeComment) {
      readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
      directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
    }
    const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
    if (extraFieldAES && (compressionMethod == COMPRESSION_METHOD_AES || directory.encrypted) && extraFieldAES.data.length >= 7) {
      readExtraFieldAES(extraFieldAES, directory, compressionMethod);
      directory.extraFieldAES = extraFieldAES;
    } else {
      if (extraFieldAES) {
        malformedExtraField = true;
      }
      directory.compressionMethod = compressionMethod;
    }
    const extraFieldPkwareUnix = extraField.get(EXTRAFIELD_TYPE_PKWARE_UNIX);
    if (extraFieldPkwareUnix) {
      readExtraFieldUnixDates(extraFieldPkwareUnix, directory);
      directory.extraFieldPkwareUnix = extraFieldPkwareUnix;
    }
    const extraFieldUnixType1 = extraField.get(EXTRAFIELD_TYPE_UNIX_TYPE1);
    if (extraFieldUnixType1) {
      readExtraFieldUnixDates(extraFieldUnixType1, directory);
      directory.extraFieldUnixType1 = extraFieldUnixType1;
    }
    const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
    if (extraFieldNTFS) {
      readExtraFieldNTFS(extraFieldNTFS, directory);
      directory.extraFieldNTFS = extraFieldNTFS;
    }
    const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
    let unixIdsRead;
    if (extraFieldUnix) {
      unixIdsRead = readExtraFieldUnix(extraFieldUnix, directory, false);
      directory.extraFieldUnix = extraFieldUnix;
    }
    if (!unixIdsRead) {
      const extraFieldInfoZip = extraField.get(EXTRAFIELD_TYPE_INFOZIP);
      if (extraFieldInfoZip) {
        readExtraFieldUnix(extraFieldInfoZip, directory, true);
        directory.extraFieldInfoZip = extraFieldInfoZip;
      }
    }
    const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
    if (extraFieldExtendedTimestamp) {
      readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
      directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
    }
    const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
    if (extraFieldUSDZ) {
      directory.extraFieldUSDZ = extraFieldUSDZ;
    }
    return malformedExtraField;
  }
  function readExtraFieldZip64(extraFieldZip64, directory, localDirectory) {
    directory.zip64 = true;
    const extraFieldView = getDataView(extraFieldZip64.data);
    const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
    const requiredLength = missingProperties.reduce((length, [, max]) => length + ZIP64_EXTRACTION[max].bytes, 0);
    if (extraFieldZip64.data.length < requiredLength) {
      if (localDirectory) {
        return false;
      }
      throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
    }
    const values = [];
    try {
      for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
        const [, max] = missingProperties[indexMissingProperty];
        const extraction = ZIP64_EXTRACTION[max];
        values.push(extraction.getValue(extraFieldView, offset));
        offset += extraction.bytes;
      }
    } catch (error) {
      if (localDirectory) {
        return false;
      }
      throw error;
    }
    missingProperties.forEach(([propertyName], indexMissingProperty) => {
      directory[propertyName] = extraFieldZip64[propertyName] = values[indexMissingProperty];
    });
    return true;
  }
  function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
    if (extraFieldUnicode.data.length < 5) {
      extraFieldUnicode.valid = false;
      return;
    }
    const extraFieldView = getDataView(extraFieldUnicode.data);
    const computedCrc32 = new Crc32();
    computedCrc32.append(fileEntry[rawPropertyName]);
    const computedCrc32View = getDataView(new Uint8Array(4));
    computedCrc32View.setUint32(0, computedCrc32.get(), true);
    const nameCrc32 = getUint32(extraFieldView, 1);
    const version = getUint8(extraFieldView, 0);
    Object.assign(extraFieldUnicode, {
      version,
      [propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
      valid: version == 1 && !fileEntry.bitFlag.languageEncodingFlag && nameCrc32 == getUint32(computedCrc32View, 0)
    });
    if (extraFieldUnicode.valid) {
      directory[propertyName] = extraFieldUnicode[propertyName];
      directory[propertyName + PROPERTY_NAME_UTF8_SUFFIX] = true;
    }
  }
  function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
    const extraFieldView = getDataView(extraFieldAES.data);
    const strength = getUint8(extraFieldView, 4);
    Object.assign(extraFieldAES, {
      vendorVersion: getUint8(extraFieldView, 0),
      vendorId: getUint8(extraFieldView, 2),
      strength,
      originalCompressionMethod: compressionMethod,
      compressionMethod: getUint16(extraFieldView, 5)
    });
    directory.compressionMethod = extraFieldAES.compressionMethod;
    if (extraFieldAES.vendorVersion != VENDOR_VERSION_AE_1) {
      directory.crc32 = UNDEFINED_VALUE;
    }
  }
  function readExtraFieldNTFS(extraFieldNTFS, directory) {
    const extraFieldView = getDataView(extraFieldNTFS.data);
    let offsetExtraField = 4;
    let tag1Data;
    try {
      while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
        const tagValue = getUint16(extraFieldView, offsetExtraField);
        const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
        if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
          tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
        }
        offsetExtraField += 4 + attributeSize;
      }
    } catch {
    }
    if (tag1Data && tag1Data.length == 24) {
      const tag1View = getDataView(tag1Data);
      const rawLastModDate = tag1View.getBigUint64(0, true);
      const rawLastAccessDate = tag1View.getBigUint64(8, true);
      const rawCreationDate = tag1View.getBigUint64(16, true);
      Object.assign(extraFieldNTFS, {
        rawLastModDate,
        rawLastAccessDate,
        rawCreationDate
      });
      const lastModDate = getDateNTFS(rawLastModDate);
      const lastAccessDate = getDateNTFS(rawLastAccessDate);
      const creationDate = getDateNTFS(rawCreationDate);
      const extraFieldData = { lastModDate, lastAccessDate, creationDate };
      Object.assign(extraFieldNTFS, extraFieldData);
      Object.assign(directory, extraFieldData, { rawLastAccessDate, rawCreationDate });
    }
  }
  function readExtraFieldUnixDates(extraField, directory) {
    if (extraField.data.length < 8) {
      return;
    }
    const extraFieldView = getDataView(extraField.data);
    const lastAccessDate = new Date((getUint32(extraFieldView, 0) | 0) * 1e3);
    const lastModDate = new Date((getUint32(extraFieldView, 4) | 0) * 1e3);
    const extraFieldData = { lastAccessDate, lastModDate };
    if (extraField.data.length >= 12) {
      extraFieldData.uid = getUint16(extraFieldView, 8);
      extraFieldData.gid = getUint16(extraFieldView, 10);
    }
    Object.assign(extraField, extraFieldData);
    Object.assign(directory, extraFieldData);
  }
  function readExtraFieldUnix(extraField, directory, isInfoZip) {
    try {
      const view = getDataView(extraField.data);
      let uid, gid;
      if (isInfoZip) {
        let offset = 0;
        const version = getUint8(view, offset++);
        const uidSize = getUint8(view, offset++);
        uid = unpackUnixId(extraField.data.subarray(offset, offset + uidSize));
        offset += uidSize;
        const gidSize = getUint8(view, offset++);
        gid = unpackUnixId(extraField.data.subarray(offset, offset + gidSize));
        Object.assign(extraField, { version, uid, gid });
      } else if (extraField.data.length >= 4) {
        uid = getUint16(view, 0);
        gid = getUint16(view, 2);
        Object.assign(extraField, { uid, gid });
      }
      if (uid !== UNDEFINED_VALUE) {
        directory.uid = uid;
      }
      if (gid !== UNDEFINED_VALUE) {
        directory.gid = gid;
      }
      return uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE;
    } catch {
    }
  }
  function unpackUnixId(bytes) {
    const buffer = new Uint8Array(4);
    buffer.set(bytes, 0);
    const view = new DataView(buffer.buffer, buffer.byteOffset, 4);
    return view.getUint32(0, true);
  }
  function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
    if (!extraFieldExtendedTimestamp.data.length) {
      return;
    }
    const extraFieldView = getDataView(extraFieldExtendedTimestamp.data);
    const flags = getUint8(extraFieldView, 0);
    const timeProperties = [];
    const timeRawProperties = [];
    if (localDirectory) {
      if ((flags & 1) == 1) {
        timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
        timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
      }
      if ((flags & 2) == 2) {
        timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
        timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
      }
      if ((flags & 4) == 4) {
        timeProperties.push(PROPERTY_NAME_CREATION_DATE);
        timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
      }
    } else if (extraFieldExtendedTimestamp.data.length >= 5) {
      timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
      timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
    }
    let offset = 1;
    timeProperties.forEach((propertyName, indexProperty) => {
      if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
        const time = getUint32(extraFieldView, offset);
        directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date((time | 0) * 1e3);
        const rawPropertyName = timeRawProperties[indexProperty];
        extraFieldExtendedTimestamp[rawPropertyName] = time;
      }
      offset += 4;
    });
  }
  async function detectOverlappingEntry({
    reader,
    fileEntry,
    index,
    offset,
    crc32,
    compressedSize,
    uncompressedSize,
    dataOffset,
    dataDescriptor,
    extraFieldZip64,
    readRanges
  }) {
    let dataDescriptorLength = 0;
    if (dataDescriptor) {
      const zip64 = Boolean(extraFieldZip64);
      const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH);
      const dataDescriptorView = getDataView(dataDescriptorArray);
      const candidates = [[zip64, true], [zip64, false], [!zip64, true], [!zip64, false]].map(([zip64Layout, signature]) => readDataDescriptor(dataDescriptorView, zip64Layout, signature)).filter((candidate) => candidate && candidate.compressedSize == compressedSize && candidate.uncompressedSize == uncompressedSize);
      const localDataDescriptor = candidates.find((candidate) => candidate.crc32 == crc32) || candidates[0] || readDataDescriptor(dataDescriptorView, zip64, true) || readDataDescriptor(dataDescriptorView, zip64, false);
      if (localDataDescriptor) {
        fileEntry.localDirectory.dataDescriptor = localDataDescriptor;
        dataDescriptorLength = getDataDescriptorLength(localDataDescriptor.zip64, localDataDescriptor.signature);
      } else {
        dataDescriptorLength = getDataDescriptorLength(zip64, false);
      }
    }
    const range = {
      start: offset,
      end: dataOffset + compressedSize + dataDescriptorLength,
      fileEntry
    };
    const { indexes, sortedRanges, pendingRanges } = readRanges;
    if (!indexes.has(index)) {
      const overlappingRange = findOverlappingRange(sortedRanges, range) || pendingRanges.find((otherRange) => rangesOverlap(range, otherRange));
      if (overlappingRange) {
        const error = new Error(ERR_OVERLAPPING_ENTRY);
        error.overlappingEntry = overlappingRange.fileEntry;
        throw error;
      }
      indexes.add(index);
      pendingRanges.push(range);
      if (pendingRanges.length * pendingRanges.length > sortedRanges.length) {
        pendingRanges.sort((range2, otherRange) => range2.start - otherRange.start);
        readRanges.sortedRanges = mergeRanges(sortedRanges, pendingRanges);
        pendingRanges.length = 0;
      }
    }
  }
  function findOverlappingRange(sortedRanges, range) {
    let low = 0;
    let high = sortedRanges.length;
    while (low < high) {
      const middle = low + high >>> 1;
      if (sortedRanges[middle].start < range.start) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }
    const previousRange = sortedRanges[low - 1];
    const nextRange = sortedRanges[low];
    if (previousRange && rangesOverlap(range, previousRange)) {
      return previousRange;
    }
    if (nextRange && rangesOverlap(range, nextRange)) {
      return nextRange;
    }
  }
  function rangesOverlap(range, otherRange) {
    return range.start < otherRange.end && otherRange.start < range.end;
  }
  function mergeRanges(sortedRanges, pendingRanges) {
    const mergedRanges = [];
    let indexSorted = 0;
    let indexPending = 0;
    while (indexSorted < sortedRanges.length || indexPending < pendingRanges.length) {
      if (indexPending == pendingRanges.length || indexSorted < sortedRanges.length && sortedRanges[indexSorted].start < pendingRanges[indexPending].start) {
        mergedRanges.push(sortedRanges[indexSorted++]);
      } else {
        mergedRanges.push(pendingRanges[indexPending++]);
      }
    }
    return mergedRanges;
  }
  function readDataDescriptor(dataDescriptorView, zip64, signature) {
    const offset = signature ? DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH : 0;
    if (dataDescriptorView.byteLength < getDataDescriptorLength(zip64, signature) || signature && getUint32(dataDescriptorView, 0) != DATA_DESCRIPTOR_RECORD_SIGNATURE) {
      return UNDEFINED_VALUE;
    }
    const crc32 = getUint32(dataDescriptorView, offset);
    let compressedSize;
    let uncompressedSize;
    try {
      if (zip64) {
        compressedSize = getBigUint64(dataDescriptorView, offset + 4);
        uncompressedSize = getBigUint64(dataDescriptorView, offset + 12);
      } else {
        compressedSize = getUint32(dataDescriptorView, offset + 4);
        uncompressedSize = getUint32(dataDescriptorView, offset + 8);
      }
    } catch {
      return UNDEFINED_VALUE;
    }
    return { signature, zip64, crc32, compressedSize, uncompressedSize };
  }
  function getDataDescriptorLength(zip64, signature) {
    return (zip64 ? DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH : DATA_DESCRIPTOR_RECORD_LENGTH) + (signature ? DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH : 0);
  }
  function getDiskOffset(reader, diskNumber) {
    return reader.getDiskOffset ? reader.getDiskOffset(diskNumber) : 0;
  }
  async function startsWithSplitZipSignature(reader) {
    return await getFirstSignature(reader) == SPLIT_ZIP_FILE_SIGNATURE;
  }
  async function startsWithSplitZipMarker(reader) {
    const signature = await getFirstSignature(reader);
    return signature == SPLIT_ZIP_FILE_SIGNATURE || signature == TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE;
  }
  async function getFirstSignature(reader) {
    const signatureArray = await readUint8Array(reader, 0, SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
    return getUint32(getDataView(signatureArray));
  }
  function isStrictnessValue(value) {
    return value === STRICTNESS_STRICT || value === STRICTNESS_BALANCED || value === STRICTNESS_TOLERANT;
  }
  function getDecodableOutputSize(outputSize, compressedSize, compressed) {
    return Math.min(outputSize, compressed ? compressedSize * MAX_DEFLATE_EXPANSION_RATIO : compressedSize);
  }
  function getStrictness(options, inheritedOptions) {
    return resolveStrictness(options, resolveStrictness(inheritedOptions, STRICTNESS_BALANCED));
  }
  function resolveStrictness(options, inheritedStrictness) {
    const strictness = options[OPTION_STRICTNESS];
    if (strictness !== UNDEFINED_VALUE) {
      if (!isStrictnessValue(strictness)) {
        throw new Error(ERR_INVALID_STRICTNESS);
      }
      return strictness;
    }
    const checkAmbiguity = options[OPTION_CHECK_AMBIGUITY];
    if (checkAmbiguity === UNDEFINED_VALUE) {
      return inheritedStrictness;
    }
    if (checkAmbiguity) {
      return STRICTNESS_STRICT;
    }
    return inheritedStrictness == STRICTNESS_TOLERANT ? STRICTNESS_TOLERANT : STRICTNESS_BALANCED;
  }
  function getCheckLocalDirectory(checkLocalDirectory, strictness) {
    if (checkLocalDirectory === UNDEFINED_VALUE) {
      return strictness != STRICTNESS_TOLERANT;
    }
    return Boolean(checkLocalDirectory);
  }
  function getCheckLocalFilename(checkLocalFilename, strictness) {
    if (checkLocalFilename === UNDEFINED_VALUE) {
      return strictness == STRICTNESS_STRICT;
    }
    return Boolean(checkLocalFilename);
  }
  function getFilenameValidation(filenameValidation, strictness) {
    if (filenameValidation === UNDEFINED_VALUE) {
      return strictness;
    }
    if (!isStrictnessValue(filenameValidation)) {
      throw new Error(ERR_INVALID_FILENAME_VALIDATION);
    }
    return filenameValidation;
  }
  function isUnsafeFilename(filename, filenameValidation) {
    if (filenameValidation == STRICTNESS_TOLERANT) {
      return false;
    }
    const pathParts = filename.split("/");
    if (pathParts.length > 1 && pathParts[pathParts.length - 1] === "") {
      pathParts.pop();
    }
    if (PARENT_DIRECTORY_REGEXP.test(filename) || filename.startsWith("/") || filename.startsWith("\\") || DRIVE_LETTER_REGEXP.test(filename)) {
      return true;
    }
    return filenameValidation == STRICTNESS_STRICT && (pathParts.includes(".") || pathParts.includes("") || filename.includes("\0"));
  }
  function getMaxAppendedDataSize(maxAppendedDataSize, strictness) {
    if (maxAppendedDataSize !== UNDEFINED_VALUE) {
      const size = toNumber(maxAppendedDataSize);
      if (typeof size != NUMBER_TYPE || Number.isNaN(size) || size < 0) {
        throw new Error(ERR_INVALID_MAX_APPENDED_DATA_SIZE);
      }
      return size;
    }
    if (strictness == STRICTNESS_STRICT) {
      return 0;
    }
    if (strictness == STRICTNESS_TOLERANT) {
      return Infinity;
    }
    return MAX_16_BITS;
  }
  async function findEndOfCentralDirectory(reader, rejectAmbiguous, maxAppendedDataSize) {
    const { size } = reader;
    const anchoredLength = Math.min(size, END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS);
    const remoteProbeBudget = { remaining: MAX_END_OF_CENTRAL_DIR_PROBES };
    let endOfDirectoryInfo;
    let plausibleEndOfDirectoryInfo;
    let endOfDirectoryReachingEndCount = 0;
    for await (const [anchoredView, anchoredOffset, anchoredArray, indexByte, offset] of scanEndOfCentralDirectory(reader, anchoredLength)) {
      const commentLength = getUint16(anchoredView, indexByte + 20);
      if (offset + END_OF_CENTRAL_DIR_LENGTH + commentLength == size) {
        const reachability = await getCentralDirectoryReachability(reader, anchoredView, anchoredOffset, indexByte, offset, size, remoteProbeBudget);
        if (reachability == CENTRAL_DIRECTORY_REACHABLE) {
          if (!endOfDirectoryInfo) {
            endOfDirectoryInfo = getEndOfCentralDirectoryInfo(anchoredArray, indexByte, offset);
          }
          endOfDirectoryReachingEndCount++;
          if (!rejectAmbiguous || endOfDirectoryReachingEndCount > 1) {
            break;
          }
        } else if (reachability == CENTRAL_DIRECTORY_PLAUSIBLE && !plausibleEndOfDirectoryInfo) {
          plausibleEndOfDirectoryInfo = getEndOfCentralDirectoryInfo(anchoredArray, indexByte, offset);
        }
      }
    }
    if (!endOfDirectoryInfo) {
      endOfDirectoryInfo = plausibleEndOfDirectoryInfo;
    }
    if (!endOfDirectoryInfo) {
      endOfDirectoryInfo = await seekEndOfCentralDirectory(reader, maxAppendedDataSize, remoteProbeBudget);
    }
    return { endOfDirectoryInfo, endOfDirectoryReachingEndCount };
  }
  async function seekEndOfCentralDirectory(reader, maxAppendedDataSize, remoteProbeBudget) {
    const { size } = reader;
    const searchLength = Math.min(size, maxAppendedDataSize == Infinity ? size : END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS + maxAppendedDataSize);
    let firstSignatureInfo, plausibleInfo;
    for await (const [searchView, searchOffset, searchArray, indexByte, offset] of scanEndOfCentralDirectory(reader, searchLength)) {
      const record = getEndOfCentralDirectoryInfo(searchArray, indexByte, offset);
      if (!firstSignatureInfo) {
        firstSignatureInfo = record;
      }
      const reachability = await getCentralDirectoryReachability(reader, searchView, searchOffset, indexByte, offset, size, remoteProbeBudget);
      if (reachability == CENTRAL_DIRECTORY_REACHABLE) {
        return record;
      }
      if (reachability == CENTRAL_DIRECTORY_PLAUSIBLE && !plausibleInfo) {
        plausibleInfo = record;
      }
    }
    return plausibleInfo || firstSignatureInfo;
  }
  async function* scanEndOfCentralDirectory(reader, scanLength) {
    const scanOffset = reader.size - scanLength;
    const scanArray = await readUint8Array(reader, scanOffset, scanLength);
    const scanView = getDataView(scanArray);
    for (let indexByte = scanArray.length - END_OF_CENTRAL_DIR_LENGTH; indexByte >= 0; indexByte--) {
      if (getUint32(scanView, indexByte) == END_OF_CENTRAL_DIR_SIGNATURE) {
        yield [scanView, scanOffset, scanArray, indexByte, scanOffset + indexByte];
      }
    }
  }
  function getEndOfCentralDirectoryInfo(scanArray, indexByte, offset) {
    return { offset, buffer: new Uint8Array(scanArray.subarray(indexByte, indexByte + END_OF_CENTRAL_DIR_LENGTH)).buffer };
  }
  async function getCentralDirectoryReachability(reader, view, anchoredOffset, indexByte, offset, size, remoteProbeBudget) {
    const filesLength = getUint16(view, indexByte + 10);
    const directoryDataLength = getUint32(view, indexByte + 12);
    const directoryDataOffset = getUint32(view, indexByte + 16);
    if (filesLength == MAX_16_BITS || directoryDataLength == MAX_32_BITS || directoryDataOffset == MAX_32_BITS) {
      const locatorSignature = await readSignature(reader, view, anchoredOffset, offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, size, remoteProbeBudget);
      return locatorSignature == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE ? CENTRAL_DIRECTORY_REACHABLE : CENTRAL_DIRECTORY_UNREACHABLE;
    }
    if (!filesLength && !directoryDataLength) {
      return CENTRAL_DIRECTORY_PLAUSIBLE;
    }
    const directoryDiskNumber = getUint16(view, indexByte + 6);
    for (const centralDirectoryOffset of [offset - directoryDataLength, getDiskOffset(reader, directoryDiskNumber) + directoryDataOffset]) {
      if (await readSignature(reader, view, anchoredOffset, centralDirectoryOffset, size, remoteProbeBudget) == CENTRAL_FILE_HEADER_SIGNATURE) {
        return CENTRAL_DIRECTORY_REACHABLE;
      }
    }
    return CENTRAL_DIRECTORY_UNREACHABLE;
  }
  async function readSignature(reader, view, anchoredOffset, signatureOffset, size, remoteProbeBudget) {
    if (signatureOffset < 0 || signatureOffset + 4 > size) {
      return UNDEFINED_VALUE;
    }
    if (signatureOffset >= anchoredOffset) {
      return getUint32(view, signatureOffset - anchoredOffset);
    }
    if (remoteProbeBudget.remaining > 0) {
      remoteProbeBudget.remaining--;
      const signatureArray = await readUint8Array(reader, signatureOffset, 4);
      return getUint32(getDataView(signatureArray), 0);
    }
    return UNDEFINED_VALUE;
  }
  function validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, warnings) {
    const { rawFilename } = zipEntry;
    const reject = !warnings;
    const maskedLocalDirectory = zipEntry.decryptedDirectory && (localDirectory.rawBitFlag & BITFLAG_MASKED_LOCAL_HEADERS) == BITFLAG_MASKED_LOCAL_HEADERS;
    if (checkLocalFilename && !maskedLocalDirectory && (rawLocalFilename.length != rawFilename.length || rawLocalFilename.some((byteValue, indexByte) => byteValue != rawFilename[indexByte]))) {
      reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME);
    }
    if ((localDirectory.rawBitFlag & BITFLAG_AMBIGUITY_MASK) != (zipEntry.rawBitFlag & BITFLAG_AMBIGUITY_MASK)) {
      reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG);
    }
    if (localDirectory.compressionMethod != zipEntry.compressionMethod) {
      reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD);
    }
    if (!localDirectory.bitFlag.dataDescriptor && !maskedLocalDirectory && (localDirectory.crc32 || localDirectory.compressedSize || localDirectory.uncompressedSize) && (localDirectory.crc32 != zipEntry.crc32 || localDirectory.compressedSize != zipEntry.compressedSize || localDirectory.uncompressedSize != zipEntry.uncompressedSize)) {
      reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES);
    }
  }
  function reportAmbiguity(reject, warnings, reason) {
    if (reject) {
      throwAmbiguousArchive(reason);
    } else {
      addWarning(warnings, reason);
    }
  }
  function throwAmbiguousArchive(reason) {
    const error = new Error(ERR_AMBIGUOUS_ARCHIVE);
    error.reason = reason;
    throw error;
  }
  function getOptionValue(zipReader, options, name) {
    return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
  }
  function getFunctionOptionValue(zipReader, options, name) {
    return checkFunctionOption(getOptionValue(zipReader, options, name));
  }
  function getDate(timeRaw) {
    const date = (timeRaw & 4294901760) >> 16, time = timeRaw & MAX_16_BITS;
    const result = new Date(1980 + ((date & 65024) >> 9), ((date & 480) >> 5) - 1, date & 31, (time & 63488) >> 11, (time & 2016) >> 5, (time & 31) * 2, 0);
    return result < MIN_DATE ? MIN_DATE : result;
  }
  function getDateNTFS(timeRaw) {
    return new Date(Number(timeRaw / BigInt(1e4) - BigInt(116444736e5)));
  }
  function getUint8(view, offset) {
    return view.getUint8(offset);
  }
  function getUint16(view, offset) {
    return view.getUint16(offset, true);
  }
  function getUint32(view, offset) {
    return view.getUint32(offset, true);
  }
  function getBigUint64(view, offset) {
    const value = view.getBigUint64(offset, true);
    if (value > MAX_SAFE_UINT64) {
      throw new Error(ERR_UNSUPPORTED_UINT64);
    }
    return Number(value);
  }
  var ERR_BAD_FORMAT, ERR_EOCDR_NOT_FOUND, ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND, ERR_CENTRAL_DIRECTORY_NOT_FOUND, ERR_LOCAL_FILE_HEADER_NOT_FOUND, ERR_EXTRAFIELD_ZIP64_NOT_FOUND, ERR_ENCRYPTED, ERR_UNSUPPORTED_ENCRYPTION, ERR_SPLIT_ZIP_FILE, ERR_OVERLAPPING_ENTRY, ERR_ENTRY_DATA_OUT_OF_BOUNDS, ERR_AMBIGUOUS_ARCHIVE, ERR_ENCRYPTED_CENTRAL_DIRECTORY, ERR_UNSAFE_FILENAME, ERR_INVALID_STRICTNESS, ERR_INVALID_FILENAME_VALIDATION, ERR_INVALID_MAX_APPENDED_DATA_SIZE, ERR_UNSUPPORTED_UINT64, WARNING_UNSORTED_CENTRAL_DIRECTORY, WARNING_UNKNOWN_VERSION, WARNING_COMPRESSED_PATCHED_DATA, WARNING_MALFORMED_EXTRA_FIELD, WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA, WARNING_WRAPPED_ENTRIES_COUNT, WARNING_APPENDED_DATA, WARNING_PREPENDED_DATA, WARNING_PREPENDED_CENTRAL_DIRECTORY, WARNING_TRAILING_CENTRAL_DIRECTORY_DATA, WARNING_DUPLICATE_FILENAME, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY, WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY, WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME, WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG, WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD, WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES, MAX_KNOWN_VERSION, DRIVE_LETTER_REGEXP, PARENT_DIRECTORY_REGEXP, CHARSET_UTF8, PROPERTY_NAME_UTF8_SUFFIX, CHARSET_CP437, BITFLAG_AMBIGUITY_MASK, VENDOR_VERSION_AE_1, ZIP64_PROPERTIES, ZIP64_EXTRACTION, MAX_SAFE_UINT64, MAX_END_OF_CENTRAL_DIR_PROBES, MAX_DEFLATE_EXPANSION_RATIO, CENTRAL_DIRECTORY_UNREACHABLE, CENTRAL_DIRECTORY_PLAUSIBLE, CENTRAL_DIRECTORY_REACHABLE, ZipReader, ZipReaderStream, ZipEntry;
  var init_zip_reader = __esm({
    "../../node_modules/@zip.js/zip.js/lib/core/zip-reader.js"() {
      init_constants();
      init_configuration();
      init_codec_registry();
      init_codec_pool();
      init_io();
      init_decode_text();
      init_array();
      init_warnings();
      init_compatible_streams();
      init_error();
      init_crc32();
      init_zip_entry();
      init_options();
      ERR_BAD_FORMAT = "File format is not recognized";
      ERR_EOCDR_NOT_FOUND = "End of central directory not found";
      ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
      ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
      ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
      ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
      ERR_ENCRYPTED = "File contains encrypted entry";
      ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
      ERR_SPLIT_ZIP_FILE = "Split zip file";
      ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
      ERR_ENTRY_DATA_OUT_OF_BOUNDS = "Entry data out of bounds";
      ERR_AMBIGUOUS_ARCHIVE = "Ambiguous archive";
      ERR_ENCRYPTED_CENTRAL_DIRECTORY = "Encrypted central directory is not supported";
      ERR_UNSAFE_FILENAME = "Unsafe filename";
      ERR_INVALID_STRICTNESS = "Invalid strictness (must be 'strict', 'balanced' or 'tolerant')";
      ERR_INVALID_FILENAME_VALIDATION = "Invalid filenameValidation (must be 'strict', 'balanced' or 'tolerant')";
      ERR_INVALID_MAX_APPENDED_DATA_SIZE = "Invalid maxAppendedDataSize (must be a number greater than or equal to 0)";
      ERR_UNSUPPORTED_UINT64 = "64-bit value exceeds Number.MAX_SAFE_INTEGER";
      WARNING_UNSORTED_CENTRAL_DIRECTORY = "unsorted central directory";
      WARNING_UNKNOWN_VERSION = "unknown version needed to extract";
      WARNING_COMPRESSED_PATCHED_DATA = "compressed patched data";
      WARNING_MALFORMED_EXTRA_FIELD = "malformed extra field";
      WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA = "unknown zip64 extensible data";
      WARNING_WRAPPED_ENTRIES_COUNT = "wrapped entries count";
      WARNING_APPENDED_DATA = "appended data";
      WARNING_PREPENDED_DATA = "prepended data";
      WARNING_PREPENDED_CENTRAL_DIRECTORY = "prepended central directory";
      WARNING_TRAILING_CENTRAL_DIRECTORY_DATA = "trailing central directory data";
      WARNING_DUPLICATE_FILENAME = "duplicate filename";
      WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY = "mismatched zip64 end of central directory record";
      WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY = "multiple end of central directory records";
      WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME = "mismatched local file header (filename)";
      WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG = "mismatched local file header (general purpose bit flag)";
      WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD = "mismatched local file header (compression method)";
      WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES = "mismatched local file header (crc32 or sizes)";
      MAX_KNOWN_VERSION = 63;
      DRIVE_LETTER_REGEXP = /^[a-zA-Z]:/;
      PARENT_DIRECTORY_REGEXP = /(^|[\\/])\.\.([\\/]|$)/;
      CHARSET_UTF8 = "utf-8";
      PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
      CHARSET_CP437 = "cp437";
      BITFLAG_AMBIGUITY_MASK = BITFLAG_ENCRYPTED | BITFLAG_DATA_DESCRIPTOR | BITFLAG_STRONG_ENCRYPTION | BITFLAG_LANG_ENCODING_FLAG;
      VENDOR_VERSION_AE_1 = 1;
      ZIP64_PROPERTIES = [
        [PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
        [PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
        [PROPERTY_NAME_OFFSET, MAX_32_BITS],
        [PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
      ];
      ZIP64_EXTRACTION = {
        [MAX_16_BITS]: {
          getValue: getUint32,
          bytes: 4
        },
        [MAX_32_BITS]: {
          getValue: getBigUint64,
          bytes: 8
        }
      };
      MAX_SAFE_UINT64 = BigInt(Number.MAX_SAFE_INTEGER);
      MAX_END_OF_CENTRAL_DIR_PROBES = 64;
      MAX_DEFLATE_EXPANSION_RATIO = 1032;
      CENTRAL_DIRECTORY_UNREACHABLE = 0;
      CENTRAL_DIRECTORY_PLAUSIBLE = 1;
      CENTRAL_DIRECTORY_REACHABLE = 2;
      ZipReader = class {
        constructor(reader, options = {}) {
          Object.assign(this, {
            reader: new GenericReader(reader),
            options,
            readRanges: { indexes: /* @__PURE__ */ new Set(), sortedRanges: [], pendingRanges: [] }
          });
        }
        async *getEntriesGenerator(options = {}) {
          const zipReader = this;
          let { reader } = zipReader;
          await initStream(reader);
          if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
            reader = new BlobReader(await streamToBlob(reader.readable));
            await initStream(reader);
          }
          if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
            throw new Error(ERR_BAD_FORMAT);
          }
          const warnings = zipReader.warnings = [];
          const strictness = getStrictness(options, zipReader.options);
          const checkAmbiguity = strictness == STRICTNESS_STRICT;
          const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
          const maxAppendedDataSize = getMaxAppendedDataSize(getOptionValue(zipReader, options, OPTION_MAX_APPENDED_DATA_SIZE), strictness);
          const filenameValidation = getFilenameValidation(getOptionValue(zipReader, options, OPTION_FILENAME_VALIDATION), strictness);
          const normalizeFilename = getOptionValue(zipReader, options, OPTION_NORMALIZE_FILENAME);
          const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
          if (!endOfDirectoryInfo) {
            if (await startsWithSplitZipSignature(reader)) {
              throw new Error(ERR_SPLIT_ZIP_FILE);
            } else {
              throw new Error(ERR_EOCDR_NOT_FOUND);
            }
          }
          if (rejectAmbiguousEndOfDirectory && endOfDirectoryReachingEndCount > 1) {
            throwAmbiguousArchive(WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY);
          }
          const endOfDirectoryView = getDataView(endOfDirectoryInfo);
          let directoryDataLength = getUint32(endOfDirectoryView, 12);
          let directoryDataOffset = getUint32(endOfDirectoryView, 16);
          const commentOffset = endOfDirectoryInfo.offset;
          const commentLength = getUint16(endOfDirectoryView, 20);
          const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
          const appendedDataLength = reader.size - appendedDataOffset;
          if (appendedDataLength > maxAppendedDataSize) {
            throwAmbiguousArchive(WARNING_APPENDED_DATA);
          }
          if (appendedDataLength > 0) {
            addWarning(warnings, WARNING_APPENDED_DATA);
          }
          let lastDiskNumber = getUint16(endOfDirectoryView, 4);
          const expectedLastDiskNumber = reader.lastDiskNumber || 0;
          let diskNumber = getUint16(endOfDirectoryView, 6);
          let filesLength = getUint16(endOfDirectoryView, 10);
          let prependedDataLength = 0;
          let prependedCentralDirectory;
          let startOffset;
          let zip64EndOfDirectory;
          let zip64EndOfDirectoryVersion2;
          let zip64EndOfDirectoryLength = ZIP64_END_OF_CENTRAL_DIR_LENGTH;
          let directoryEncryptionInfo;
          const requiresZip64 = directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS;
          if (directoryDataOffset != MAX_32_BITS && diskNumber != MAX_16_BITS) {
            directoryDataOffset += getDiskOffset(reader, diskNumber);
          }
          if (requiresZip64) {
            const endOfDirectoryLocatorArray = endOfDirectoryInfo.offset >= ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH ? await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH) : EMPTY_UINT8_ARRAY;
            const endOfDirectoryLocatorView = getDataView(endOfDirectoryLocatorArray);
            if (endOfDirectoryLocatorArray.length == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH && getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
              directoryDataOffset = getDiskOffset(reader, getUint32(endOfDirectoryLocatorView, 4)) + getBigUint64(endOfDirectoryLocatorView, 8);
              let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
              let endOfDirectoryView2 = getDataView(endOfDirectoryArray);
              const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
              if ((endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32(endOfDirectoryView2, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) && directoryDataOffset != expectedDirectoryDataOffset && expectedDirectoryDataOffset >= 0) {
                const originalDirectoryDataOffset = directoryDataOffset;
                directoryDataOffset = expectedDirectoryDataOffset;
                if (directoryDataOffset > originalDirectoryDataOffset) {
                  prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
                }
                endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
                endOfDirectoryView2 = getDataView(endOfDirectoryArray);
              }
              if (endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32(endOfDirectoryView2, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
                throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
              }
              zip64EndOfDirectory = true;
              zip64EndOfDirectoryVersion2 = getBigUint64(endOfDirectoryView2, 4) > ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12;
              if (zip64EndOfDirectoryVersion2) {
                const extensibleDataLength = Math.min(
                  getBigUint64(endOfDirectoryView2, 4) - (ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12),
                  reader.size - directoryDataOffset - ZIP64_END_OF_CENTRAL_DIR_LENGTH
                );
                if (extensibleDataLength > 0) {
                  zip64EndOfDirectoryLength += extensibleDataLength;
                  const rawExtensibleData = await readUint8Array(reader, directoryDataOffset + ZIP64_END_OF_CENTRAL_DIR_LENGTH, extensibleDataLength);
                  directoryEncryptionInfo = getDirectoryEncryptionInfo(rawExtensibleData);
                }
              }
              if (lastDiskNumber == MAX_16_BITS) {
                lastDiskNumber = getUint32(endOfDirectoryView2, 16);
              } else if (lastDiskNumber != getUint32(endOfDirectoryView2, 16)) {
                reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
              }
              if (diskNumber == MAX_16_BITS) {
                diskNumber = getUint32(endOfDirectoryView2, 20);
              } else if (diskNumber != getUint32(endOfDirectoryView2, 20)) {
                reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
              }
              if (filesLength == MAX_16_BITS) {
                filesLength = getBigUint64(endOfDirectoryView2, 32);
              } else if (filesLength != getBigUint64(endOfDirectoryView2, 32)) {
                reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
              }
              if (directoryDataLength == MAX_32_BITS) {
                directoryDataLength = getBigUint64(endOfDirectoryView2, 40);
              } else if (directoryDataLength != getBigUint64(endOfDirectoryView2, 40)) {
                reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
              }
              directoryDataOffset = getDiskOffset(reader, diskNumber) + getBigUint64(endOfDirectoryView2, 48) + prependedDataLength;
            }
          }
          let declaredDirectoryDataLength = directoryDataLength;
          const centralDirectoryEndOffset = endOfDirectoryInfo.offset - (zip64EndOfDirectory ? zip64EndOfDirectoryLength + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH : 0);
          if (directoryDataOffset >= reader.size) {
            prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
            directoryDataOffset = reader.size - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
          }
          if (expectedLastDiskNumber != lastDiskNumber) {
            throw new Error(ERR_SPLIT_ZIP_FILE);
          }
          if (directoryDataOffset < 0) {
            throw new Error(ERR_BAD_FORMAT);
          }
          let offset = 0;
          let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
          let directoryView = getDataView(directoryArray);
          if (directoryDataLength) {
            if (directoryArray.length < 4) {
              throw new Error(ERR_BAD_FORMAT);
            }
            const expectedDirectoryDataOffset = centralDirectoryEndOffset - directoryDataLength;
            if (directoryDataOffset != expectedDirectoryDataOffset && diskNumber == lastDiskNumber) {
              const storedPointsAtDirectory = getUint32(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE || Boolean(directoryEncryptionInfo && directoryEncryptionInfo.compressedSize) || detectEncryptedCentralDirectory(directoryView);
              let reconcile = !storedPointsAtDirectory;
              if (!reconcile && expectedDirectoryDataOffset >= 0 && expectedDirectoryDataOffset + 4 <= reader.size) {
                const expectedSignatureArray = await readUint8Array(reader, expectedDirectoryDataOffset, 4);
                reconcile = getUint32(getDataView(expectedSignatureArray), 0) == CENTRAL_FILE_HEADER_SIGNATURE;
              }
              if (reconcile) {
                const originalDirectoryDataOffset = directoryDataOffset;
                directoryDataOffset = expectedDirectoryDataOffset;
                if (directoryDataOffset > originalDirectoryDataOffset) {
                  prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
                  prependedCentralDirectory = storedPointsAtDirectory;
                }
                directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
                directoryView = getDataView(directoryArray);
              }
            }
          }
          const expectedDirectoryDataLength = centralDirectoryEndOffset - directoryDataOffset;
          if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0 && diskNumber == lastDiskNumber) {
            directoryDataLength = expectedDirectoryDataLength;
            directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
            directoryView = getDataView(directoryArray);
          }
          if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
            throw new Error(ERR_BAD_FORMAT);
          }
          zipReader.directoryOffset = directoryDataOffset;
          zipReader.directoryLength = declaredDirectoryDataLength;
          const decryptCentralDirectory = getFunctionOptionValue(zipReader, options, OPTION_DECRYPT_CENTRAL_DIRECTORY);
          let decryptedDirectory, dataAfterEncryptedDirectory;
          if (decryptCentralDirectory && filesLength && directoryArray.length >= 4 && getUint32(directoryView, 0) != CENTRAL_FILE_HEADER_SIGNATURE && (zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
            const encryptedDirectoryDataLength = getEncryptedDirectoryDataLength(directoryEncryptionInfo, declaredDirectoryDataLength, directoryArray.length);
            dataAfterEncryptedDirectory = directoryArray.subarray(encryptedDirectoryDataLength);
            directoryArray = await decryptCentralDirectory(directoryArray.subarray(0, encryptedDirectoryDataLength), directoryEncryptionInfo);
            directoryView = getDataView(directoryArray);
            declaredDirectoryDataLength = directoryArray.length;
            decryptedDirectory = true;
          }
          if (directoryEncryptionInfo && !decryptedDirectory && (directoryArray.length < 4 || getUint32(directoryView, 0) == CENTRAL_FILE_HEADER_SIGNATURE)) {
            addWarning(warnings, WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA);
          }
          startOffset = directoryDataOffset;
          const filenameEncoding = getOptionValue(zipReader, options, OPTION_FILENAME_ENCODING);
          const commentEncoding = getOptionValue(zipReader, options, OPTION_COMMENT_ENCODING);
          const filenames = /* @__PURE__ */ new Set();
          let duplicateFilename;
          let previousEntryPosition = -1;
          const recoverWrappedFilesLength = !checkAmbiguity && !zip64EndOfDirectory;
          if (!filesLength && recoverWrappedFilesLength) {
            filesLength = getWrappedFilesLength(directoryView, directoryArray, offset);
            if (filesLength) {
              addWarning(warnings, WARNING_WRAPPED_ENTRIES_COUNT);
            }
          }
          for (let indexFile = 0; indexFile < filesLength; indexFile++) {
            const fileEntry = new ZipEntry(reader, zipReader.options);
            if (offset + CENTRAL_FILE_HEADER_LENGTH > directoryArray.length || getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
              if (indexFile == 0 && !decryptedDirectory && (zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
                throw new Error(ERR_ENCRYPTED_CENTRAL_DIRECTORY);
              }
              throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
            }
            readCommonHeader(fileEntry, directoryView, offset + 6);
            const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
            const filenameOffset = offset + CENTRAL_FILE_HEADER_LENGTH;
            const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
            const commentOffset2 = extraFieldOffset + fileEntry.extraFieldLength;
            const versionMadeBy = getUint16(directoryView, offset + 4);
            const msDosCompatible = versionMadeBy >> 8 == 0;
            const unixCompatible = versionMadeBy >> 8 == 3;
            const commentLength2 = getUint16(directoryView, offset + 32);
            const endOffset = commentOffset2 + commentLength2;
            const rawEntryData = new Uint8Array(directoryArray.subarray(filenameOffset, endOffset));
            const rawFilename = rawEntryData.subarray(0, fileEntry.filenameLength);
            const rawComment = rawEntryData.subarray(fileEntry.filenameLength + fileEntry.extraFieldLength);
            const filenameUTF8 = languageEncodingFlag || !filenameEncoding && isUTF8Text(rawFilename);
            const commentUTF8 = languageEncodingFlag || !commentEncoding && isUTF8Text(rawComment);
            const externalFileAttributes = getUint32(directoryView, offset + 38);
            const msdosAttributesRaw = externalFileAttributes & MAX_8_BITS;
            const msdosAttributes = {
              readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
              hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
              system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
              directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
              archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
            };
            const offsetFileEntry = getUint32(directoryView, offset + 42);
            const decode2 = getFunctionOptionValue(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
            const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
            const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
            let filename = decode2(rawFilename, rawFilenameEncoding, TEXT_TYPE_FILENAME);
            if (filename === UNDEFINED_VALUE) {
              filename = decodeText(rawFilename, rawFilenameEncoding);
            }
            if (normalizeFilename) {
              const normalizedFilename = normalizeFilename(filename);
              if (normalizedFilename !== UNDEFINED_VALUE) {
                filename = normalizedFilename;
              }
            }
            if (isUnsafeFilename(filename, filenameValidation)) {
              const error = new Error(ERR_UNSAFE_FILENAME);
              error.filename = filename;
              throw error;
            }
            let comment = decode2(rawComment, rawCommentEncoding, TEXT_TYPE_COMMENT);
            if (comment === UNDEFINED_VALUE) {
              comment = decodeText(rawComment, rawCommentEncoding);
            }
            Object.assign(fileEntry, {
              index: indexFile,
              decryptedDirectory,
              versionMadeBy,
              msDosCompatible,
              zip64: false,
              compressedSize: 0,
              uncompressedSize: 0,
              commentLength: commentLength2,
              offset: offsetFileEntry,
              diskNumberStart: getUint16(directoryView, offset + 34),
              internalFileAttributes: getUint16(directoryView, offset + 36),
              externalFileAttributes,
              msdosAttributesRaw,
              msdosAttributes,
              rawFilename,
              filenameUTF8,
              commentUTF8,
              rawExtraField: rawEntryData.subarray(fileEntry.filenameLength, fileEntry.filenameLength + fileEntry.extraFieldLength),
              rawComment,
              filename,
              comment
            });
            if (readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6)) {
              addWarning(warnings, WARNING_MALFORMED_EXTRA_FIELD, filename);
            }
            fileEntry.offset += prependedDataLength;
            const entryPosition = getDiskOffset(reader, fileEntry.diskNumberStart) + fileEntry.offset;
            startOffset = Math.min(entryPosition, startOffset);
            if (entryPosition < previousEntryPosition) {
              addWarning(warnings, WARNING_UNSORTED_CENTRAL_DIRECTORY, filename);
            }
            previousEntryPosition = entryPosition;
            if ((fileEntry.version & MAX_8_BITS) > MAX_KNOWN_VERSION) {
              addWarning(warnings, WARNING_UNKNOWN_VERSION, filename);
            }
            if ((fileEntry.rawBitFlag & BITFLAG_COMPRESSED_PATCHED_DATA) == BITFLAG_COMPRESSED_PATCHED_DATA) {
              addWarning(warnings, WARNING_COMPRESSED_PATCHED_DATA, filename);
            }
            if (filenames.has(fileEntry.filename)) {
              duplicateFilename = true;
            }
            filenames.add(fileEntry.filename);
            const unixExternalUpper = fileEntry.externalFileAttributes >> 16 & MAX_16_BITS;
            if (fileEntry.unixMode === UNDEFINED_VALUE && (unixExternalUpper & (FILE_ATTR_UNIX_DEFAULT_MASK | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_TYPE_DIR)) != 0) {
              fileEntry.unixMode = unixExternalUpper;
            }
            const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
            const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
            const sticky = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_STICKY_MASK);
            const unixType = fileEntry.unixMode === UNDEFINED_VALUE ? unixExternalUpper : fileEntry.unixMode;
            const symlink = (unixType & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_SYMLINK;
            const executable = !symlink && (fileEntry.unixMode !== UNDEFINED_VALUE ? (fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0 : unixCompatible && (unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0);
            const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && (fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR;
            const upperIsDir = (unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR;
            Object.assign(fileEntry, {
              setuid,
              setgid,
              sticky,
              symlink,
              unixExternalUpper,
              executable,
              directory: modeIsDir || upperIsDir || msDosCompatible && msdosAttributes.directory || fileEntry.filename.endsWith(DIRECTORY_SIGNATURE),
              zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
            });
            const entry = new Entry(fileEntry);
            entry.getData = (writer, options2) => fileEntry.getData(writer, entry, zipReader.readRanges, options2);
            entry.arrayBuffer = async (options2) => {
              const writer = new TransformStream();
              const arrayBufferPromise = streamToBlob(writer.readable).then((blob) => blob.arrayBuffer());
              arrayBufferPromise.catch(() => {
              });
              await fileEntry.getData(
                writer,
                entry,
                zipReader.readRanges,
                Object.assign({}, options2, { preventClose: false })
              );
              return arrayBufferPromise;
            };
            offset = endOffset;
            if (indexFile == filesLength - 1 && recoverWrappedFilesLength) {
              const wrappedFilesLength = getWrappedFilesLength(directoryView, directoryArray, offset);
              if (wrappedFilesLength) {
                filesLength += wrappedFilesLength;
                addWarning(warnings, WARNING_WRAPPED_ENTRIES_COUNT);
              }
            }
            const { onprogress } = options;
            if (onprogress) {
              try {
                await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
              } catch {
              }
            }
            yield entry;
          }
          let offsetAfterSignature = offset;
          let digitalSignature = readDigitalSignature(directoryArray.subarray(offset)) || (decryptedDirectory ? readDigitalSignature(dataAfterEncryptedDirectory) : UNDEFINED_VALUE);
          if (!digitalSignature && !decryptedDirectory) {
            const signatureRecordOffset = directoryDataOffset + offset;
            const signatureRecordLength = Math.min(centralDirectoryEndOffset - signatureRecordOffset, 6 + MAX_16_BITS);
            if (signatureRecordLength >= 6) {
              digitalSignature = readDigitalSignature(await readUint8Array(reader, signatureRecordOffset, signatureRecordLength));
            }
          }
          if (digitalSignature) {
            zipReader.digitalSignature = digitalSignature;
            offsetAfterSignature = offset + 6 + digitalSignature.length;
          }
          if (offset != declaredDirectoryDataLength && offsetAfterSignature != declaredDirectoryDataLength || !decryptedDirectory && offset != directoryDataLength && offsetAfterSignature != directoryDataLength) {
            reportAmbiguity(checkAmbiguity, warnings, WARNING_TRAILING_CENTRAL_DIRECTORY_DATA);
          }
          if (duplicateFilename) {
            reportAmbiguity(checkAmbiguity, warnings, WARNING_DUPLICATE_FILENAME);
          }
          const extractPrependedData = getOptionValue(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
          const extractAppendedData = getOptionValue(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
          const splitZipSignatureLength = (checkAmbiguity || extractPrependedData) && filesLength && startOffset == SPLIT_ZIP_FILE_SIGNATURE_LENGTH && await startsWithSplitZipMarker(reader) ? SPLIT_ZIP_FILE_SIGNATURE_LENGTH : 0;
          if (checkAmbiguity && (prependedDataLength || filesLength && startOffset > splitZipSignatureLength)) {
            throwAmbiguousArchive(WARNING_PREPENDED_DATA);
          }
          if (prependedDataLength || filesLength && startOffset > SPLIT_ZIP_FILE_SIGNATURE_LENGTH) {
            addWarning(warnings, WARNING_PREPENDED_DATA);
          }
          if (prependedCentralDirectory) {
            addWarning(warnings, WARNING_PREPENDED_CENTRAL_DIRECTORY);
          }
          if (extractPrependedData) {
            zipReader.prependedData = startOffset > splitZipSignatureLength ? await readUint8Array(reader, splitZipSignatureLength, startOffset - splitZipSignatureLength) : EMPTY_UINT8_ARRAY;
          }
          zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : EMPTY_UINT8_ARRAY;
          if (extractAppendedData) {
            zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : EMPTY_UINT8_ARRAY;
          }
          return true;
        }
        async getEntries(options = {}) {
          const entries = [];
          for await (const entry of this.getEntriesGenerator(options)) {
            entries.push(entry);
          }
          return entries;
        }
        async close() {
          const { reader } = this;
          if (!reader.readUint8Array && reader.readable && !reader.readable.locked) {
            await reader.readable.cancel();
          }
        }
        [SYMBOL_ASYNC_DISPOSE]() {
          return this.close();
        }
      };
      ZipReaderStream = class {
        constructor(options = {}) {
          let sourceController;
          const { readable, writable } = new TransformStream({
            start(controller) {
              sourceController = controller;
            }
          });
          const zipReader = new ZipReader(readable, options);
          const gen = zipReader.getEntriesGenerator();
          const pendingEntries2 = /* @__PURE__ */ new Set();
          this.readable = new ReadableStream({
            async pull(controller) {
              const { done, value } = await gen.next();
              if (done)
                return controller.close();
              const entryStream = createEntryStream(value, pendingEntries2);
              const chunk = {
                ...value,
                readable: entryStream.readable
              };
              delete chunk.getData;
              Object.defineProperties(chunk, {
                localDirectory: {
                  get: () => value.localDirectory,
                  enumerable: true
                },
                warnings: {
                  get: () => value.warnings,
                  enumerable: true
                }
              });
              controller.enqueue(chunk);
            },
            async cancel(reason) {
              const entryStreams = Array.from(pendingEntries2);
              pendingEntries2.clear();
              sourceController.error(reason);
              await Promise.allSettled(entryStreams.map((entryStream) => entryStream.cancel(reason)));
              await Promise.allSettled([gen.return(), zipReader.close()]);
            }
          });
          this.writable = writable;
        }
      };
      ZipEntry = class {
        constructor(reader, options) {
          Object.assign(this, {
            reader,
            options
          });
        }
        async getData(writer, fileEntry, readRanges, options = {}) {
          const zipEntry = this;
          const config2 = getConfiguration();
          const {
            reader,
            index,
            offset,
            diskNumberStart,
            extraFieldAES,
            extraFieldZip64,
            compressionMethod,
            bitFlag,
            rawBitFlag,
            crc32,
            rawLastModDate,
            uncompressedSize,
            compressedSize
          } = zipEntry;
          const {
            dataDescriptor
          } = bitFlag;
          const localDirectory = fileEntry.localDirectory = {};
          const warnings = fileEntry.warnings = [];
          const localHeaderOffset = getDiskOffset(reader, diskNumberStart) + offset;
          const dataArray = await readUint8Array(reader, localHeaderOffset, HEADER_SIZE);
          const dataView = getDataView(dataArray);
          let password = getOptionValue(zipEntry, options, OPTION_PASSWORD);
          let rawPassword = getOptionValue(zipEntry, options, OPTION_RAW_PASSWORD);
          const passThrough = checkPassThroughOption(getOptionValue(zipEntry, options, OPTION_PASS_THROUGH));
          const passThroughCompression = Boolean(passThrough);
          const passThroughEncryption = passThrough === true;
          checkPasswordOption(password, rawPassword);
          password = password && password.length ? password : UNDEFINED_VALUE;
          rawPassword = rawPassword && rawPassword.length ? rawPassword : UNDEFINED_VALUE;
          if (extraFieldAES) {
            if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
              throw new Error(ERR_UNSUPPORTED_COMPRESSION);
            }
          }
          if (dataArray.length < HEADER_SIZE || getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
            throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
          }
          readCommonHeader(localDirectory, dataView, 4);
          const {
            extraFieldLength,
            filenameLength
          } = localDirectory;
          const dataOffset = localDirectory.dataOffset = localHeaderOffset + HEADER_SIZE + filenameLength + extraFieldLength;
          const checkLocalDirectoryOption = getOptionValue(zipEntry, options, OPTION_CHECK_LOCAL_DIRECTORY);
          const entryStrictness = getStrictness(options, zipEntry.options);
          const checkLocalDirectory = getCheckLocalDirectory(checkLocalDirectoryOption, entryStrictness);
          const checkLocalFilenameOption = getOptionValue(zipEntry, options, OPTION_CHECK_LOCAL_FILENAME);
          const checkLocalFilename = getCheckLocalFilename(
            checkLocalFilenameOption === UNDEFINED_VALUE ? checkLocalDirectoryOption : checkLocalFilenameOption,
            entryStrictness
          );
          let rawLocalFilename = EMPTY_UINT8_ARRAY;
          if (checkLocalFilename && (filenameLength || extraFieldLength)) {
            const trailingDataArray = await readUint8Array(reader, localHeaderOffset + HEADER_SIZE, filenameLength + extraFieldLength);
            rawLocalFilename = trailingDataArray.subarray(0, filenameLength);
            localDirectory.rawExtraField = trailingDataArray.subarray(filenameLength);
          } else {
            localDirectory.rawExtraField = extraFieldLength ? await readUint8Array(reader, localHeaderOffset + HEADER_SIZE + filenameLength, extraFieldLength) : EMPTY_UINT8_ARRAY;
          }
          if (checkLocalFilename) {
            localDirectory.rawFilename = rawLocalFilename;
          }
          if (readCommonFooter(zipEntry, localDirectory, dataView, 4, true)) {
            addWarning(warnings, WARNING_MALFORMED_EXTRA_FIELD);
          }
          validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, checkLocalDirectory ? UNDEFINED_VALUE : warnings);
          const { lastAccessDate, creationDate, uid, gid } = localDirectory;
          if (lastAccessDate) {
            fileEntry.lastAccessDate = lastAccessDate;
          }
          if (creationDate) {
            fileEntry.creationDate = creationDate;
          }
          if (uid !== UNDEFINED_VALUE && fileEntry.uid === UNDEFINED_VALUE) {
            fileEntry.uid = uid;
          }
          if (gid !== UNDEFINED_VALUE && fileEntry.gid === UNDEFINED_VALUE) {
            fileEntry.gid = gid;
          }
          const checkPasswordOnly = getOptionValue(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
          const encrypted = zipEntry.encrypted && (!passThroughEncryption || checkPasswordOnly);
          const zipCrypto = encrypted && !extraFieldAES;
          if (!passThroughEncryption) {
            fileEntry.zipCrypto = zipCrypto;
          }
          if (encrypted && (zipEntry.rawBitFlag & BITFLAG_STRONG_ENCRYPTION) == BITFLAG_STRONG_ENCRYPTION) {
            throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
          }
          const registeredCodec = passThroughCompression ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
          if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !registeredCodec && !passThroughCompression) {
            throw new Error(ERR_UNSUPPORTED_COMPRESSION);
          }
          if (encrypted) {
            if (!zipCrypto && (extraFieldAES.strength < 1 || extraFieldAES.strength > 3)) {
              throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
            } else if (!password && !rawPassword) {
              throw new Error(ERR_ENCRYPTED);
            }
          }
          if (dataOffset + compressedSize > reader.size) {
            throw new Error(ERR_ENTRY_DATA_OUT_OF_BOUNDS);
          }
          const size = compressedSize;
          const signal = checkSignalOption(getOptionValue(zipEntry, options, OPTION_SIGNAL));
          throwIfAborted(signal);
          let checkOverlappingEntry = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
          const checkOverlappingEntryOnly = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
          if (checkOverlappingEntryOnly) {
            checkOverlappingEntry = true;
          }
          const { onstart, onprogress, onend } = options;
          const compressed = compressionMethod != COMPRESSION_METHOD_STORE && !passThroughCompression;
          const outputSize = passThroughCompression ? compressedSize - getEncryptionOverhead(encrypted, zipCrypto, extraFieldAES && extraFieldAES.strength) : uncompressedSize;
          const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
          let useCompressionStream = getOptionValue(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
          if (deflate64) {
            useCompressionStream = false;
          }
          const checkCrc32Option = getOptionValue(zipEntry, options, OPTION_CHECK_CRC32);
          const checkCrc32 = (checkCrc32Option === UNDEFINED_VALUE ? getOptionValue(zipEntry, options, OPTION_CHECK_SIGNATURE) : checkCrc32Option) && !passThroughCompression && (!encrypted || zipCrypto || extraFieldAES && extraFieldAES.vendorVersion == VENDOR_VERSION_AE_1);
          const workerOptions = {
            options: {
              codecType: CODEC_INFLATE,
              password,
              rawPassword,
              zipCrypto,
              encryptionStrength: extraFieldAES && extraFieldAES.strength,
              checkCrc32,
              checkAuthenticationCode: getOptionValue(zipEntry, options, OPTION_CHECK_AUTHENTICATION_CODE),
              passwordVerification: zipCrypto && (dataDescriptor ? rawLastModDate >>> 8 & MAX_8_BITS : crc32 >>> 24 & MAX_8_BITS),
              outputSize,
              crc32,
              compressed,
              encrypted,
              useWebWorkers: getOptionValue(zipEntry, options, OPTION_USE_WEB_WORKERS),
              useCompressionStream,
              transferStreams: getOptionValue(zipEntry, options, OPTION_TRANSFER_STREAMS),
              deflate64,
              format: registeredCodec ? registeredCodec.format : UNDEFINED_VALUE,
              codecURI: registeredCodec ? registeredCodec.codecURI : UNDEFINED_VALUE,
              compressionMethod,
              rawBitFlag,
              checkPasswordOnly
            },
            config: config2,
            streamOptions: { signal, size, onstart, onprogress, onend }
          };
          if (checkOverlappingEntry) {
            await detectOverlappingEntry({
              reader,
              fileEntry,
              index,
              offset: localHeaderOffset,
              crc32,
              compressedSize,
              uncompressedSize,
              dataOffset,
              dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
              extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
              readRanges
            });
          }
          let writable, abortError, aborted;
          try {
            if (!checkOverlappingEntryOnly) {
              if (checkPasswordOnly) {
                writer = new WritableStream();
              }
              writer = new GenericWriter(writer);
              await initStream(writer, getDecodableOutputSize(outputSize, compressedSize, compressed));
              ({ writable } = writer);
              const readable = toCompatibleReadable(reader.createReadable({ offset: dataOffset, size }));
              const { outputSize: writtenSize } = await runWorker2({ readable, writable }, workerOptions);
              throwIfAborted(signal);
              if (writtenSize != outputSize) {
                throw Object.assign(new Error(ERR_INVALID_UNCOMPRESSED_SIZE), { outputSize: writtenSize });
              }
              writer.size += writtenSize;
            }
          } catch (error) {
            const { outputSize: failedOutputSize } = workerOptions;
            if (failedOutputSize !== UNDEFINED_VALUE) {
              writer.size += failedOutputSize;
            } else if (isErrorObject(error) && error.outputSize !== UNDEFINED_VALUE) {
              writer.size += error.outputSize;
            }
            if (!checkPasswordOnly || !isErrorObject(error) || error.message != ERR_ABORT_CHECK_PASSWORD) {
              abortError = error;
              aborted = true;
              throw error;
            }
          } finally {
            const preventClose = !ownsWritable(writer) && getOptionValue(zipEntry, options, OPTION_PREVENT_CLOSE);
            if (!preventClose && writable && !writable.locked) {
              const writableWriter = writable.getWriter();
              if (aborted) {
                try {
                  await writableWriter.abort(abortError);
                } catch {
                }
              } else {
                await writableWriter.close();
              }
            }
          }
          return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
        }
      };
    }
  });

  // src/api.ts
  var PixivApiError = class extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  };
  var PixivApi = class {
    artworkCache = /* @__PURE__ */ new Map();
    csrfToken = "";
    /** 获取作品数据；失败的请求不会写入缓存。 */
    async getArtwork(id, signal) {
      signal?.throwIfAborted();
      const cached = this.artworkCache.get(id);
      if (cached) return cached;
      return this.refreshArtwork(id, signal);
    }
    /** 绕过缓存获取最新作品数据，并保持已有缓存对象的引用不变。 */
    async refreshArtwork(id, signal) {
      signal?.throwIfAborted();
      const data = await this.request(
        `/ajax/illust/${id}?time=${Date.now()}`,
        { signal }
      );
      if (data.error || !data.body) {
        throw new PixivApiError(data.message || "\u83B7\u53D6\u4F5C\u54C1\u6570\u636E\u5931\u8D25", 200);
      }
      const cached = this.artworkCache.get(id);
      if (cached) {
        Object.assign(cached, data.body);
        return cached;
      }
      this.artworkCache.set(id, data.body);
      return data.body;
    }
    /** 获取 Ugoira 压缩包地址和逐帧延迟。 */
    async getUgoiraMetadata(id, signal) {
      const data = await this.request(
        `/ajax/illust/${id}/ugoira_meta`,
        { signal }
      );
      if (data.error || !data.body) {
        throw new PixivApiError(data.message || "\u83B7\u53D6\u52A8\u56FE\u6570\u636E\u5931\u8D25", 200);
      }
      return data.body;
    }
    /** 将作品公开收藏并附带原始标签。 */
    async addBookmark(artwork) {
      await this.sendBookmark(artwork, false);
    }
    /** 使用收藏记录 ID 取消收藏。 */
    async deleteBookmark(artworkId, bookmarkId) {
      await this.sendDeleteBookmark(artworkId, bookmarkId, false);
    }
    /** 发送收藏请求；token 失效时只刷新并重试一次。 */
    async sendBookmark(artwork, tokenRefreshed) {
      const token = await this.getCsrfToken(artwork.id, tokenRefreshed);
      try {
        await this.request("/ajax/illusts/bookmarks/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-csrf-token": token
          },
          body: JSON.stringify({
            comment: "",
            illust_id: artwork.illustId || artwork.id,
            restrict: 0,
            tags: artwork.tags.tags.map(({ tag }) => tag)
          })
        });
      } catch (error) {
        if (error instanceof PixivApiError && error.status === 400 && !tokenRefreshed) {
          this.csrfToken = "";
          await this.sendBookmark(artwork, true);
          return;
        }
        throw error;
      }
    }
    /** 发送取消收藏请求；token 失效时只刷新并重试一次。 */
    async sendDeleteBookmark(artworkId, bookmarkId, tokenRefreshed) {
      const token = await this.getCsrfToken(artworkId, tokenRefreshed);
      try {
        await this.request(
          "/ajax/illusts/bookmarks/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
              "x-csrf-token": token
            },
            body: new URLSearchParams({ bookmark_id: bookmarkId })
          }
        );
      } catch (error) {
        if (error instanceof PixivApiError && error.status === 400 && !tokenRefreshed) {
          this.csrfToken = "";
          await this.sendDeleteBookmark(artworkId, bookmarkId, true);
          return;
        }
        throw error;
      }
    }
    /** 从当前页面或作品页面源码中读取 CSRF token。 */
    async getCsrfToken(artworkId, forceRefresh) {
      if (this.csrfToken && !forceRefresh) return this.csrfToken;
      const currentSource = document.querySelector("#__NEXT_DATA__")?.textContent;
      let token = this.extractCsrfToken(currentSource || document.documentElement.innerHTML);
      if (!token || forceRefresh) {
        const response = await fetch(`/artworks/${artworkId}`, {
          credentials: "same-origin",
          cache: "no-store"
        });
        if (!response.ok) {
          throw new PixivApiError("\u65E0\u6CD5\u5237\u65B0\u6536\u85CF\u51ED\u8BC1", response.status);
        }
        token = this.extractCsrfToken(await response.text());
      }
      if (!token) throw new PixivApiError("\u9875\u9762\u4E2D\u672A\u627E\u5230\u6536\u85CF\u51ED\u8BC1", 0);
      this.csrfToken = token;
      return token;
    }
    /** 兼容 Pixiv 页面中未转义和反斜杠转义的 token。 */
    extractCsrfToken(source) {
      const patterns = [
        /"token":"([a-f\d]{32})"/i,
        /\\"token\\":\\"([a-f\d]{32})\\"/i,
        /"postKey":"([a-f\d]{32})"/i,
        /\\"postKey\\":\\"([a-f\d]{32})\\"/i
      ];
      for (const pattern of patterns) {
        const token = source.match(pattern)?.[1];
        if (token) return token;
      }
      return "";
    }
    /** 发送同源请求并统一处理 HTTP 与 Pixiv 业务错误。 */
    async request(url, init) {
      const response = await fetch(url, {
        credentials: "same-origin",
        ...init
      });
      if (!response.ok) {
        throw new PixivApiError(`Pixiv \u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, response.status);
      }
      const data = await response.json();
      if (data.error) {
        throw new PixivApiError(data.message || "Pixiv \u8BF7\u6C42\u5931\u8D25", response.status);
      }
      return data;
    }
  };

  // src/bookmark-controller.ts
  var BookmarkController = class {
    constructor(api, notification) {
      this.api = api;
      this.notification = notification;
    }
    pending = /* @__PURE__ */ new Set();
    /** 启动收藏操作，并返回本次请求是否成功。 */
    async add(artwork, cardElement) {
      if (artwork.bookmarkData) {
        this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5DF2\u7ECF\u6536\u85CF", "info");
        return false;
      }
      if (this.pending.has(artwork.id)) {
        this.notification.show("\u6536\u85CF\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D", "info");
        return false;
      }
      this.pending.add(artwork.id);
      this.notification.show("\u6B63\u5728\u6536\u85CF\u4F5C\u54C1", "info");
      try {
        await this.api.addBookmark(artwork);
        artwork.bookmarkData = { id: "", private: false };
        artwork.bookmarkCount++;
        this.syncBookmarkIcon(cardElement);
        this.notification.show("\u5DF2\u6536\u85CF", "success");
        return true;
      } catch (error) {
        this.notification.show(this.getErrorMessage(error), "error");
        return false;
      } finally {
        this.pending.delete(artwork.id);
      }
    }
    /** 查询服务端最新状态后取消收藏，并返回删除请求是否成功。 */
    async remove(artwork, cardElement) {
      if (this.pending.has(artwork.id)) {
        this.notification.show("\u6536\u85CF\u72B6\u6001\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D", "info");
        return false;
      }
      this.pending.add(artwork.id);
      this.notification.show("\u6B63\u5728\u68C0\u67E5\u6536\u85CF\u72B6\u6001", "info");
      try {
        const latestArtwork = await this.api.refreshArtwork(artwork.id);
        const bookmarkId = latestArtwork.bookmarkData?.id;
        if (!bookmarkId) {
          this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5C1A\u672A\u6536\u85CF", "info");
          return false;
        }
        await this.api.deleteBookmark(artwork.id, bookmarkId);
        latestArtwork.bookmarkData = null;
        latestArtwork.bookmarkCount = Math.max(0, latestArtwork.bookmarkCount - 1);
        this.syncUnbookmarkIcon(cardElement);
        this.notification.show("\u5DF2\u53D6\u6D88\u6536\u85CF", "success");
        return true;
      } catch (error) {
        this.notification.show(this.getErrorMessage(error, "\u53D6\u6D88\u6536\u85CF"), "error");
        return false;
      } finally {
        this.pending.delete(artwork.id);
      }
    }
    /** 将明确识别出的 Pixiv 收藏按钮同步为红心，不触发原生收藏操作。 */
    syncBookmarkIcon(cardElement) {
      if (!cardElement) return;
      const bookmarkSvg = this.findBookmarkSvg(cardElement);
      if (bookmarkSvg && getComputedStyle(bookmarkSvg).color !== "rgb(255, 64, 96)") {
        bookmarkSvg.style.color = "rgb(255, 64, 96)";
        for (const path of bookmarkSvg.querySelectorAll("path")) {
          path.style.fill = "currentcolor";
        }
      }
      const oneClickBookmark = cardElement.querySelector("._one-click-bookmark");
      if (!oneClickBookmark?.classList.contains("on")) {
        oneClickBookmark?.classList.add("on");
      }
    }
    /** 将明确识别出的 Pixiv 收藏按钮恢复为空心状态。 */
    syncUnbookmarkIcon(cardElement) {
      if (!cardElement) return;
      const bookmarkSvg = this.findBookmarkSvg(cardElement);
      if (bookmarkSvg) {
        bookmarkSvg.style.removeProperty("color");
        for (const path of bookmarkSvg.querySelectorAll("path")) {
          path.style.removeProperty("fill");
        }
        const visiblePaths = bookmarkSvg.querySelectorAll(
          "g[mask] > path"
        );
        if (visiblePaths.length > 1) {
          visiblePaths[visiblePaths.length - 1].style.fill = "rgba(255, 64, 96, 0)";
        }
      }
      cardElement.querySelector("._one-click-bookmark")?.classList.remove("on");
    }
    /** 严格查找新版 Pixiv 缩略图的收藏图标。 */
    findBookmarkSvg(cardElement) {
      const bookmarkButton = cardElement.querySelector(
        'button[data-ga4-label="bookmark_button"]'
      ) || cardElement.querySelector('button svg[width="32"]')?.closest("button");
      return bookmarkButton?.querySelector("svg") || void 0;
    }
    /** 将常见 HTTP 状态转换成可操作的错误提示。 */
    getErrorMessage(error, action = "\u6536\u85CF") {
      if (!(error instanceof PixivApiError)) return `${action}\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5`;
      switch (error.status) {
        case 401:
          return `${action}\u5931\u8D25\uFF0C\u8BF7\u5148\u767B\u5F55 Pixiv`;
        case 403:
          return `${action}\u5931\u8D25\uFF0C\u8D26\u53F7\u5F53\u524D\u65E0\u6743\u6267\u884C\u6B64\u64CD\u4F5C`;
        case 429:
          return `${action}\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5`;
        default:
          return `${action}\u5931\u8D25\uFF1A${error.message}`;
      }
    }
  };

  // src/task-queue.ts
  async function consumeTasks(tasks, workerCount, consume, signal) {
    let cursor = 0;
    const consumeNext = async () => {
      while (!signal.aborted && cursor < tasks.length) {
        const task = tasks[cursor++];
        try {
          await consume(task);
        } catch {
        }
      }
    };
    const count = Math.min(Math.max(1, Math.floor(workerCount)), tasks.length);
    await Promise.all(Array.from({ length: count }, consumeNext));
  }

  // src/browser-image-cache.ts
  var BrowserImageCache = class {
    /** 按最近访问顺序保存作品缓存。 */
    works = /* @__PURE__ */ new Map();
    /** 最多保留的作品数量。 */
    maxWorks;
    /** 当前唯一的后台预加载队列。 */
    preloadTask;
    constructor(maxWorks = 3) {
      this.maxWorks = maxWorks;
    }
    /** 为预览创建缓存图片副本；在途预加载存在时先等待同一任务。 */
    async createImage(artworkId, index, signal) {
      const cache = this.works.get(artworkId);
      if (!cache) return;
      this.touch(artworkId, cache);
      let source = cache.images.get(index);
      const inFlight = cache.inFlight.get(index);
      if (!source && inFlight) {
        source = await this.waitForImage(inFlight, signal);
      }
      if (!source || this.works.get(artworkId) !== cache) return;
      signal.throwIfAborted();
      const image = new Image();
      image.alt = source.alt;
      image.fetchPriority = "high";
      return this.loadImage(image, source.currentSrc || source.src, signal, true);
    }
    /** 使用多个 worker 按页码顺序领取并补齐作品图片。 */
    preload(artwork, currentIndex, getUrl, workerCount) {
      if (this.preloadTask?.artworkId === artwork.id) {
        return this.preloadTask.promise;
      }
      this.cancelPreload();
      const cache = this.getOrCreate(artwork.id);
      const tasks = Array.from({ length: artwork.pageCount }, (_, index) => index).filter((index) => index !== currentIndex).filter((index) => !cache.images.has(index));
      const controller = new AbortController();
      const task = {
        artworkId: artwork.id,
        controller,
        promise: Promise.resolve()
      };
      task.promise = consumeTasks(
        tasks,
        workerCount,
        (index) => this.preloadImage(artwork, index, getUrl(index), cache, controller.signal),
        controller.signal
      ).finally(() => {
        if (this.preloadTask === task) this.preloadTask = void 0;
      });
      this.preloadTask = task;
      return task.promise;
    }
    /** 取消当前作品尚未完成的全部预加载。 */
    cancelPreload() {
      this.preloadTask?.controller.abort();
      this.preloadTask = void 0;
    }
    /** 更新 LRU 容量，并立即淘汰超出限制的旧作品。 */
    setMaxWorks(maxWorks) {
      this.maxWorks = maxWorks;
      this.evictOldest();
    }
    /** 取消预加载并释放全部图片引用。 */
    clear() {
      this.cancelPreload();
      for (const cache of this.works.values()) this.release(cache);
      this.works.clear();
    }
    /** 加载单张预加载图片，并登记在途任务供前台复用。 */
    async preloadImage(artwork, index, url, cache, signal) {
      if (cache.images.has(index) || cache.inFlight.has(index)) return;
      const image = new Image();
      image.alt = artwork.title;
      image.decoding = "async";
      image.fetchPriority = "low";
      const loading = this.loadImage(image, url, signal, false);
      cache.inFlight.set(index, loading);
      const loaded = await loading;
      if (cache.inFlight.get(index) === loading) cache.inFlight.delete(index);
      if (!loaded || signal.aborted) return;
      if (this.works.get(artwork.id) !== cache) return;
      cache.images.set(index, loaded);
    }
    /** 等待共享图片任务，同时只响应当前前台请求自己的取消信号。 */
    waitForImage(loading, signal) {
      signal.throwIfAborted();
      return new Promise((resolve, reject) => {
        const abort2 = () => {
          cleanup();
          reject(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError"));
        };
        const cleanup = () => signal.removeEventListener("abort", abort2);
        signal.addEventListener("abort", abort2, { once: true });
        void loading.then(
          (image) => {
            cleanup();
            resolve(image);
          },
          (error) => {
            cleanup();
            reject(error);
          }
        );
      });
    }
    /** 获取并刷新作品的 LRU 顺序。 */
    getOrCreate(artworkId) {
      const cache = this.works.get(artworkId) || { images: /* @__PURE__ */ new Map(), inFlight: /* @__PURE__ */ new Map() };
      this.touch(artworkId, cache);
      return cache;
    }
    /** 将作品移动到队尾。 */
    touch(artworkId, cache) {
      this.works.delete(artworkId);
      this.works.set(artworkId, cache);
      this.evictOldest();
    }
    /** 释放超出容量限制的最旧作品。 */
    evictOldest() {
      while (this.works.size > this.maxWorks) {
        const oldestId = this.works.keys().next().value;
        if (!oldestId) return;
        if (this.preloadTask?.artworkId === oldestId) this.cancelPreload();
        const oldest = this.works.get(oldestId);
        this.works.delete(oldestId);
        if (oldest) this.release(oldest);
      }
    }
    /** 清空一个作品持有的原生图片引用。 */
    release(cache) {
      for (const image of cache.images.values()) image.src = "";
      cache.images.clear();
      cache.inFlight.clear();
    }
    /** 加载原生图片，并在取消时终止尚未完成的请求。 */
    loadImage(image, url, signal, rejectOnAbort) {
      return new Promise((resolve, reject) => {
        let settled = false;
        const finish = (result, error) => {
          if (settled) return;
          settled = true;
          signal.removeEventListener("abort", abort2);
          image.onload = null;
          image.onerror = null;
          if (error) reject(error);
          else resolve(result);
        };
        const abort2 = () => {
          image.src = "";
          const error = rejectOnAbort ? new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError") : void 0;
          finish(void 0, error);
        };
        signal.addEventListener("abort", abort2, { once: true });
        image.onload = () => finish(image);
        image.onerror = () => finish();
        image.src = url;
        if (image.complete && image.naturalWidth > 0) finish(image);
        if (signal.aborted) abort2();
      });
    }
  };

  // src/notification.ts
  var Notification = class {
    container = document.createElement("div");
    constructor() {
      this.container.className = "ppv-toast-container";
      document.body.append(this.container);
    }
    /** 显示一条会自动消失的提示。 */
    show(message, type) {
      const toast = document.createElement("div");
      toast.className = `ppv-toast ppv-toast-${type}`;
      toast.textContent = message;
      this.container.append(toast);
      window.setTimeout(() => toast.classList.add("ppv-toast-leave"), 2200);
      window.setTimeout(() => toast.remove(), 2500);
    }
  };

  // src/artwork-locator.ts
  var ArtworkLocator = class {
    /** 查找当前事件对应的作品；标题等不含图片的链接不会触发预览。 */
    find(target) {
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href*="/artworks/"]');
      if (!link || !link.querySelector("img")) return;
      const id = new URL(link.href, location.href).pathname.match(
        /^\/artworks\/(\d+)/
      )?.[1];
      if (!id) return;
      return {
        id,
        element: link,
        cardElement: this.findCardElement(link, id)
      };
    }
    /** 查找只对应当前作品且包含收藏按钮的最小卡片容器。 */
    findCardElement(link, artworkId) {
      let element = link.parentElement;
      while (element && element !== document.body) {
        const artworkIds = new Set(
          [...element.querySelectorAll('a[href*="/artworks/"]')].map((item) => this.getArtworkId(item.href)).filter((id) => Boolean(id))
        );
        if (artworkIds.size > 1 || !artworkIds.has(artworkId)) return;
        if (element.querySelector("button svg") || element.querySelector("._one-click-bookmark")) {
          return element;
        }
        element = element.parentElement;
      }
    }
    /** 从作品链接中提取数字 ID。 */
    getArtworkId(url) {
      return new URL(url, location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1];
    }
  };

  // src/preview-controller.ts
  var WHEEL_THROTTLE = 100;
  var INFO_HEIGHT = 25;
  var VIEWPORT_MARGIN = 8;
  var PREVIEW_GAP = 6;
  var PreviewController = class {
    constructor(api, renderer, bookmarkController, notification, settings) {
      this.api = api;
      this.renderer = renderer;
      this.bookmarkController = bookmarkController;
      this.notification = notification;
      this.settings = settings;
      this.wrap.className = "ppv-preview";
      this.info.className = "ppv-preview-info";
      this.loadingPanel.className = "ppv-preview-loading-panel";
      this.loadingText.className = "ppv-preview-loading-text";
      this.progressTrack.className = "ppv-preview-progress-track";
      this.progressBar.className = "ppv-preview-progress-bar ppv-preview-progress-bar-indeterminate";
      this.progressTrack.append(this.progressBar);
      this.loadingPanel.append(this.loadingText, this.progressTrack);
      this.wrap.append(this.info, this.loadingPanel);
      document.body.append(this.wrap);
      this.bindEvents();
    }
    wrap = document.createElement("div");
    info = document.createElement("div");
    loadingPanel = document.createElement("div");
    loadingText = document.createElement("div");
    progressTrack = document.createElement("div");
    progressBar = document.createElement("div");
    locator = new ArtworkLocator();
    activeTarget;
    artwork;
    activeRequest;
    renderedArtwork;
    index = 0;
    showTimer;
    version = 0;
    lastWheelTime = 0;
    currentUrl = location.href;
    routeObserver = new MutationObserver(() => {
      if (location.href === this.currentUrl) return;
      this.currentUrl = location.href;
      this.hide();
    });
    /** 使用事件委托绑定 Pixiv 动态页面所需的所有事件。 */
    bindEvents() {
      document.addEventListener("pointerover", this.onPointerOver, true);
      document.addEventListener("pointerout", this.onPointerOut, true);
      window.addEventListener("wheel", this.onWheel, {
        capture: true,
        passive: false
      });
      window.addEventListener("keydown", this.onKeyDown, true);
      window.addEventListener("scroll", this.hide, true);
      window.addEventListener("resize", this.hide);
      window.addEventListener("blur", this.hide);
      window.addEventListener("popstate", this.hide);
      this.routeObserver.observe(document.body, { childList: true, subtree: true });
    }
    /** 在进入新的作品缩略图后开始延迟预览。 */
    onPointerOver = (event) => {
      const target = this.locator.find(event.target);
      if (!target) return;
      if (this.activeTarget?.element === target.element) return;
      this.hide();
      this.activeTarget = target;
      const version = ++this.version;
      this.showTimer = window.setTimeout(() => {
        void this.show(target, version);
      }, this.settings.value.showDelay);
    };
    /** 真正离开当前作品链接时关闭预览。 */
    onPointerOut = (event) => {
      if (!this.activeTarget) return;
      if (event.target instanceof Node && !this.activeTarget.element.contains(event.target)) {
        return;
      }
      if (event.relatedTarget instanceof Node && this.activeTarget.element.contains(event.relatedTarget)) {
        return;
      }
      this.hide();
    };
    /** 加载作品与第一页，并在确认请求仍有效后显示。 */
    async show(target, version) {
      const request = this.startRequest();
      this.showLoading(target.element, "\u6B63\u5728\u83B7\u53D6\u4F5C\u54C1\u4FE1\u606F");
      try {
        const artwork = await this.api.getArtwork(target.id, request.signal);
        if (!this.isCurrent(target, version)) return;
        this.artwork = artwork;
        if (artwork.bookmarkData) {
          this.bookmarkController.syncBookmarkIcon(target.cardElement);
        }
        this.index = 0;
        this.showLoading(target.element, "\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90");
        await this.render(version, request.signal);
      } catch (error) {
        this.handlePreviewError(error, target, version);
      }
    }
    /** 加载当前页图片并原子替换预览内容。 */
    async render(version, signal) {
      const artwork = this.artwork;
      const target = this.activeTarget;
      if (!artwork || !target) return;
      const index = this.index;
      const rendered = await this.renderer.load(
        artwork,
        index,
        signal,
        (progress) => {
          if (this.isCurrent(target, version) && this.index === index) {
            this.updateLoadingProgress(progress);
          }
        }
      );
      if (!this.isCurrent(target, version) || this.index !== index) {
        rendered.dispose();
        return;
      }
      this.renderedArtwork = rendered;
      const media = rendered.element;
      media.className = "ppv-preview-media";
      this.wrap.querySelector(".ppv-preview-media")?.remove();
      this.updateInfo(artwork, rendered.width, rendered.height);
      this.sizeAndPosition(media, rendered.width, rendered.height, target.element);
      this.wrap.append(media);
      this.wrap.classList.remove("ppv-preview-loading");
      this.wrap.classList.add("ppv-preview-visible", "ppv-preview-ready");
      void this.renderer.preload(artwork, index);
    }
    /** 显示小型加载窗口，并重置为等待网络响应的状态。 */
    showLoading(element, message) {
      this.loadingText.textContent = message;
      this.progressBar.style.width = "";
      this.progressBar.classList.add("ppv-preview-progress-bar-indeterminate");
      this.positionWrap(element, 220, 68);
      this.wrap.classList.remove("ppv-preview-ready");
      this.wrap.classList.add("ppv-preview-visible", "ppv-preview-loading");
    }
    /** 使用 Tampermonkey 提供的真实下载字节更新进度。 */
    updateLoadingProgress(progress) {
      if (progress.total) {
        const percent = Math.min(
          100,
          Math.round(progress.loaded / progress.total * 100)
        );
        this.loadingText.textContent = `${this.formatBytes(progress.loaded)} / ${this.formatBytes(progress.total)} (${percent}%)`;
        this.progressBar.classList.remove(
          "ppv-preview-progress-bar-indeterminate"
        );
        this.progressBar.style.width = `${percent}%`;
        return;
      }
      this.loadingText.textContent = `\u5DF2\u52A0\u8F7D ${this.formatBytes(progress.loaded)}`;
    }
    /** 将字节数格式化成适合加载窗口显示的短文本。 */
    formatBytes(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    /** 更新顶部摘要信息。 */
    updateInfo(artwork, width, height) {
      this.info.replaceChildren();
      const values = [
        artwork.pageCount > 1 ? `${this.index + 1}/${artwork.pageCount}` : "",
        `\u6536\u85CF ${artwork.bookmarkCount}`,
        `${width}\xD7${height}`,
        artwork.title
      ];
      values.forEach((value, index) => {
        if (!value) return;
        const span = document.createElement("span");
        span.textContent = value;
        if (index === values.length - 1) span.className = "ppv-preview-title";
        this.info.append(span);
      });
    }
    /** 按真实图片比例缩放，并放到缩略图空间较大的一侧。 */
    sizeAndPosition(media, mediaWidth, mediaHeight, element) {
      const rect = element.getBoundingClientRect();
      const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN;
      const rightSpace = window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN;
      const placeLeft = leftSpace >= rightSpace;
      const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace);
      const availableHeight = window.innerHeight - VIEWPORT_MARGIN * 2 - INFO_HEIGHT;
      const scale = Math.min(
        1,
        availableWidth / mediaWidth,
        availableHeight / mediaHeight
      );
      const width = Math.max(1, Math.floor(mediaWidth * scale));
      const height = Math.max(1, Math.floor(mediaHeight * scale));
      this.positionWrap(element, width, height + INFO_HEIGHT, placeLeft);
      media.style.height = `${height}px`;
    }
    /** 把加载窗口或图片预览放到缩略图空间较大的一侧。 */
    positionWrap(element, requestedWidth, height, preferredLeft) {
      const rect = element.getBoundingClientRect();
      const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN;
      const rightSpace = window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN;
      const placeLeft = preferredLeft ?? leftSpace >= rightSpace;
      const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace);
      const width = Math.min(requestedWidth, Math.max(120, availableWidth));
      const rawLeft = placeLeft ? rect.left - PREVIEW_GAP - width : rect.right + PREVIEW_GAP;
      const left = Math.min(
        Math.max(VIEWPORT_MARGIN, rawLeft),
        window.innerWidth - width - VIEWPORT_MARGIN
      );
      const centeredTop = rect.top + rect.height / 2 - height / 2;
      const top = Math.min(
        Math.max(VIEWPORT_MARGIN, centeredTop),
        window.innerHeight - height - VIEWPORT_MARGIN
      );
      this.wrap.style.width = `${Math.round(width)}px`;
      this.wrap.style.left = `${Math.round(left)}px`;
      this.wrap.style.top = `${Math.round(top)}px`;
    }
    /** 在当前缩略图上滚动时循环切换多图页码。 */
    onWheel = (event) => {
      if (!this.artwork || !this.activeTarget || this.artwork.pageCount <= 1 || !this.wrap.classList.contains("ppv-preview-visible") || !(event.target instanceof Node) || !this.activeTarget.element.contains(event.target)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      if (now - this.lastWheelTime < WHEEL_THROTTLE) return;
      this.lastWheelTime = now;
      const count = this.artwork.pageCount;
      this.index = (this.index + (event.deltaY < 0 ? -1 : 1) + count) % count;
      const target = this.activeTarget;
      const version = ++this.version;
      const request = this.startRequest();
      this.showLoading(target.element, "\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90");
      void this.render(version, request.signal).catch((error) => {
        this.handlePreviewError(error, target, version);
      });
    };
    /** 预览显示时处理关闭、收藏与取消收藏快捷键。 */
    onKeyDown = (event) => {
      if (!this.artwork || !this.wrap.classList.contains("ppv-preview-visible") || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }
      if (event.code === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
        return;
      }
      if (event.code !== "KeyB" && event.code !== "KeyU" || event.repeat) return;
      event.preventDefault();
      event.stopPropagation();
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) activeElement.blur();
      const artwork = this.artwork;
      const cardElement = this.activeTarget?.cardElement;
      const operation = event.code === "KeyB" ? this.bookmarkController.add(artwork, cardElement) : this.bookmarkController.remove(artwork, cardElement);
      void operation.then(() => {
        const rendered = this.renderedArtwork;
        if (this.artwork === artwork && rendered) {
          this.updateInfo(artwork, rendered.width, rendered.height);
        }
      });
    };
    /** 终止旧任务并创建只属于当前预览请求的取消信号。 */
    startRequest() {
      this.activeRequest?.abort();
      this.renderedArtwork?.dispose();
      this.renderedArtwork = void 0;
      this.wrap.querySelector(".ppv-preview-media")?.remove();
      const request = new AbortController();
      this.activeRequest = request;
      return request;
    }
    /** 忽略主动取消，只向当前预览报告真实请求错误。 */
    handlePreviewError(error, target, version) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (this.isCurrent(target, version)) {
        const message = error instanceof PixivApiError && error.status === 429 ? "\u9884\u89C8\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" : "\u9884\u89C8\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
        this.notification.show(message, "error");
        this.hide();
      }
      console.error("[Pixiv Preview]", error);
    }
    /** 检查异步结果是否仍属于当前悬浮目标。 */
    isCurrent(target, version) {
      return this.activeTarget?.element === target.element && this.version === version;
    }
    /** 清理所有可见状态并使旧异步任务失效。 */
    hide = () => {
      window.clearTimeout(this.showTimer);
      this.activeRequest?.abort();
      this.renderer.cancelPreload();
      this.activeRequest = void 0;
      this.renderedArtwork?.dispose();
      this.renderedArtwork = void 0;
      this.version++;
      this.activeTarget = void 0;
      this.artwork = void 0;
      this.index = 0;
      this.wrap.classList.remove(
        "ppv-preview-visible",
        "ppv-preview-loading",
        "ppv-preview-ready"
      );
      this.wrap.querySelector(".ppv-preview-media")?.remove();
    };
  };

  // src/image-url.ts
  function getImageUrl(artwork, index, quality) {
    return artwork.urls[quality].replace(/_p0(?=[_.])/, `_p${index}`);
  }

  // src/renderer.ts
  var StaticArtworkRenderer = class {
    constructor(cache, settings) {
      this.cache = cache;
      this.settings = settings;
    }
    /** 下载指定页并返回可主动释放的 Blob 图片。 */
    async load(artwork, index, signal, onProgress) {
      const cachedImage = await this.cache.createImage(
        artwork.id,
        index,
        signal
      );
      if (cachedImage) {
        onProgress({ loaded: 1, total: 1 });
        return {
          element: cachedImage,
          width: cachedImage.naturalWidth,
          height: cachedImage.naturalHeight,
          dispose: () => {
            cachedImage.src = "";
          }
        };
      }
      return this.download(artwork, index, signal, onProgress);
    }
    /** 并发预加载作品的所有图片到浏览器缓存。 */
    preload(artwork, currentIndex) {
      if (!this.settings.value.preloadEnabled) return Promise.resolve();
      return this.cache.preload(
        artwork,
        currentIndex,
        (index) => this.getUrl(artwork, index),
        this.settings.value.preloadWorkers
      );
    }
    /** 取消当前作品的后台预加载。 */
    cancelPreload() {
      this.cache.cancelPreload();
    }
    /** 使用 GM 请求下载未命中的图片并报告真实进度。 */
    download(artwork, index, signal, onProgress) {
      return new Promise((resolve, reject) => {
        let request;
        let objectUrl = "";
        let settled = false;
        const cleanup = () => signal.removeEventListener("abort", abort2);
        const fail = (error) => {
          if (settled) return;
          settled = true;
          cleanup();
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          reject(error);
        };
        const abort2 = () => {
          request?.abort();
          fail(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError"));
        };
        signal.addEventListener("abort", abort2, { once: true });
        request = GM_xmlhttpRequest({
          method: "GET",
          url: this.getUrl(artwork, index),
          headers: { Referer: "https://www.pixiv.net/" },
          responseType: "blob",
          onprogress: (event) => {
            if (settled) return;
            onProgress({
              loaded: event.loaded,
              total: event.lengthComputable && event.total > 0 ? event.total : void 0
            });
          },
          onload: (response) => {
            if (signal.aborted) return abort2();
            if (response.status < 200 || response.status >= 300) {
              fail(
                new Error(
                  `\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
                )
              );
              return;
            }
            onProgress({
              loaded: response.response.size,
              total: response.response.size
            });
            objectUrl = URL.createObjectURL(response.response);
            const image = new Image();
            image.alt = artwork.title;
            image.onload = () => {
              if (signal.aborted) return abort2();
              settled = true;
              cleanup();
              resolve({
                element: image,
                width: image.naturalWidth,
                height: image.naturalHeight,
                dispose: () => {
                  image.src = "";
                  URL.revokeObjectURL(objectUrl);
                }
              });
            };
            image.onerror = () => fail(new Error("\u9884\u89C8\u56FE\u7247\u89E3\u7801\u5931\u8D25"));
            image.src = objectUrl;
          },
          onerror: (response) => {
            fail(
              new Error(
                `\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
              )
            );
          },
          onabort: () => fail(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError")),
          ontimeout: () => fail(new Error("\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u8D85\u65F6"))
        });
        if (signal.aborted) abort2();
      });
    }
    /** 由当前清晰度的第一页地址生成指定页地址。 */
    getUrl(artwork, index) {
      return getImageUrl(artwork, index, this.settings.value.imageQuality);
    }
  };
  var ArtworkRendererDispatcher = class {
    constructor(staticRenderer, ugoiraRenderer) {
      this.staticRenderer = staticRenderer;
      this.ugoiraRenderer = ugoiraRenderer;
    }
    load(artwork, index, signal, onProgress) {
      return this.getRenderer(artwork).load(artwork, index, signal, onProgress);
    }
    preload(artwork, currentIndex) {
      if (artwork.illustType === 2) return Promise.resolve();
      return this.staticRenderer.preload(artwork, currentIndex);
    }
    cancelPreload() {
      this.staticRenderer.cancelPreload();
      this.ugoiraRenderer.cancelPreload();
    }
    getUrl(artwork, index) {
      return this.getRenderer(artwork).getUrl(artwork, index);
    }
    getRenderer(artwork) {
      return artwork.illustType === 2 ? this.ugoiraRenderer : this.staticRenderer;
    }
  };

  // src/settings.ts
  var DEFAULT_SETTINGS = {
    preloadEnabled: true,
    preloadWorkers: 4,
    cacheWorks: 3,
    showDelay: 400,
    imageQuality: "regular"
  };
  var SettingsStore = class {
    /** 当前生效的设置。 */
    settings;
    /** 所有设置变更订阅者。 */
    listeners = /* @__PURE__ */ new Set();
    /** 油猴存储适配器。 */
    storage;
    constructor(storage) {
      this.storage = storage;
      try {
        this.settings = normalizeSettings(storage.get());
      } catch {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    }
    /** 获取当前设置的只读快照。 */
    get value() {
      return this.settings;
    }
    /** 校验、保存设置并通知所有订阅者。 */
    save(value) {
      this.settings = normalizeSettings(value);
      this.storage.set(this.settings);
      for (const listener of this.listeners) listener(this.settings);
    }
    /** 订阅设置变更，并返回取消订阅方法。 */
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
  };
  function normalizeSettings(value) {
    const source = typeof value === "object" && value !== null ? value : {};
    const preloadWorkers = source.preloadWorkers;
    const cacheWorks = source.cacheWorks;
    const showDelay = source.showDelay;
    return {
      preloadEnabled: typeof source.preloadEnabled === "boolean" ? source.preloadEnabled : DEFAULT_SETTINGS.preloadEnabled,
      preloadWorkers: Number.isInteger(preloadWorkers) && Number(preloadWorkers) >= 1 && Number(preloadWorkers) <= 8 ? Number(preloadWorkers) : DEFAULT_SETTINGS.preloadWorkers,
      cacheWorks: Number.isInteger(cacheWorks) && Number(cacheWorks) >= 1 && Number(cacheWorks) <= 10 ? Number(cacheWorks) : DEFAULT_SETTINGS.cacheWorks,
      showDelay: Number.isInteger(showDelay) && Number(showDelay) >= 0 && Number(showDelay) <= 2e3 ? Number(showDelay) : DEFAULT_SETTINGS.showDelay,
      imageQuality: source.imageQuality === "original" || source.imageQuality === "regular" ? source.imageQuality : DEFAULT_SETTINGS.imageQuality
    };
  }

  // src/settings-panel.ts
  var SettingsPanel = class {
    constructor(store, notification) {
      this.store = store;
      this.notification = notification;
      this.root.className = "ppv-settings-backdrop";
      this.root.innerHTML = `
      <div class="ppv-settings-panel" role="dialog" aria-modal="true" aria-labelledby="ppv-settings-title">
        <div class="ppv-settings-header">
          <strong id="ppv-settings-title">Pixiv Preview \u8BBE\u7F6E</strong>
          <button type="button" class="ppv-settings-close" aria-label="\u5173\u95ED">\xD7</button>
        </div>
        <div class="ppv-settings-fields"></div>
        <div class="ppv-settings-actions">
          <button type="button" class="ppv-settings-defaults">\u6062\u590D\u9ED8\u8BA4\u503C</button>
          <button type="submit" class="ppv-settings-save">\u4FDD\u5B58</button>
        </div>
      </div>`;
      this.form.className = "ppv-settings-form";
      const panel = this.root.firstElementChild;
      const fields = panel.querySelector(".ppv-settings-fields");
      fields.append(
        this.createCheckbox("preloadEnabled", "\u542F\u7528\u540E\u53F0\u9884\u52A0\u8F7D"),
        this.createNumber("preloadWorkers", "\u9884\u52A0\u8F7D worker \u6570", 1, 8),
        this.createNumber("cacheWorks", "\u7F13\u5B58\u4F5C\u54C1\u6570", 1, 10),
        this.createNumber("showDelay", "\u60AC\u6D6E\u5EF6\u8FDF\uFF08\u6BEB\u79D2\uFF09", 0, 2e3),
        this.createQuality()
      );
      this.form.append(...panel.childNodes);
      panel.append(this.form);
      document.body.append(this.root);
      this.bindEvents();
      GM_registerMenuCommand("Pixiv Preview \u8BBE\u7F6E", this.open);
    }
    /** 设置面板遮罩容器。 */
    root = document.createElement("div");
    /** 设置表单。 */
    form = document.createElement("form");
    /** 创建布尔设置控件。 */
    createCheckbox(name, labelText) {
      const label = document.createElement("label");
      label.className = "ppv-settings-row ppv-settings-checkbox-row";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = name;
      label.append(input, labelText);
      return label;
    }
    /** 创建带范围限制的数字设置控件。 */
    createNumber(name, labelText, min, max) {
      const label = document.createElement("label");
      label.className = "ppv-settings-row";
      const text = document.createElement("span");
      text.textContent = labelText;
      const input = document.createElement("input");
      input.type = "number";
      input.name = name;
      input.min = String(min);
      input.max = String(max);
      input.step = "1";
      input.required = true;
      label.append(text, input);
      return label;
    }
    /** 创建图片清晰度选择控件。 */
    createQuality() {
      const label = document.createElement("label");
      label.className = "ppv-settings-row";
      const text = document.createElement("span");
      text.textContent = "\u56FE\u7247\u6E05\u6670\u5EA6";
      const select = document.createElement("select");
      select.name = "imageQuality";
      select.innerHTML = `
      <option value="regular">\u6807\u51C6\uFF08regular\uFF09</option>
      <option value="original">\u539F\u56FE\uFF08original\uFF09</option>`;
      label.append(text, select);
      return label;
    }
    /** 绑定面板内交互。 */
    bindEvents() {
      this.root.addEventListener("click", (event) => {
        if (event.target === this.root || event.target instanceof Element && event.target.closest(".ppv-settings-close")) {
          this.close();
        }
      });
      this.root.querySelector(".ppv-settings-defaults")?.addEventListener("click", () => this.fill(DEFAULT_SETTINGS));
      this.form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!this.form.reportValidity()) return;
        this.store.save(this.read());
        this.notification.show("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58", "success");
        this.close();
      });
      window.addEventListener(
        "keydown",
        (event) => {
          if (event.code === "Escape" && this.root.classList.contains("is-open")) {
            event.preventDefault();
            event.stopPropagation();
            this.close();
          }
        },
        true
      );
    }
    /** 从表单读取通过浏览器校验的设置。 */
    read() {
      const data = new FormData(this.form);
      return {
        preloadEnabled: data.get("preloadEnabled") === "on",
        preloadWorkers: Number(data.get("preloadWorkers")),
        cacheWorks: Number(data.get("cacheWorks")),
        showDelay: Number(data.get("showDelay")),
        imageQuality: data.get("imageQuality") === "original" ? "original" : "regular"
      };
    }
    /** 将设置写入表单控件。 */
    fill(settings) {
      const get = (name) => this.form.elements.namedItem(name);
      get("preloadEnabled").checked = settings.preloadEnabled;
      get("preloadWorkers").value = String(settings.preloadWorkers);
      get("cacheWorks").value = String(settings.cacheWorks);
      get("showDelay").value = String(settings.showDelay);
      get("imageQuality").value = settings.imageQuality;
    }
    /** 显示设置面板并填入当前值。 */
    open = () => {
      this.fill(this.store.value);
      this.root.classList.add("is-open");
      this.form.elements.namedItem("preloadWorkers").focus();
    };
    /** 关闭设置面板。 */
    close() {
      this.root.classList.remove("is-open");
    }
  };

  // src/style.ts
  var style = `
.ppv-preview {
  position: fixed;
  z-index: 2147483646;
  display: none;
  overflow: hidden;
  padding: 0;
  border: 2px solid #0096fa;
  border-radius: 3px;
  background: rgba(0, 150, 250, .1);
  box-shadow: 0 4px 18px rgba(0, 0, 0, .32);
  pointer-events: none;
}
.ppv-preview-visible { display: block; }
.ppv-preview-loading { background: rgba(24, 24, 24, .94); }
.ppv-preview-loading .ppv-preview-info { display: none; }
.ppv-preview-ready .ppv-preview-loading-panel { display: none; }
.ppv-preview-info {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 25px;
  overflow: hidden;
  color: #fff;
  background: #0096fa;
  font-family: Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  white-space: nowrap;
}
.ppv-preview-info span {
  flex: 0 0 auto;
  padding: 0 6px;
  overflow: hidden;
  font-size: 12px;
  line-height: 25px;
  text-overflow: ellipsis;
}
.ppv-preview-info .ppv-preview-title { flex-shrink: 1; }
.ppv-preview-media { display: block; width: 100%; height: auto; }
.ppv-preview-loading-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  min-height: 68px;
  padding: 12px;
  color: #fff;
  font: 13px/1.4 Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
.ppv-preview-loading-text {
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ppv-preview-progress-track {
  height: 5px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(255, 255, 255, .25);
}
.ppv-preview-progress-bar {
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: #29b6f6;
  transition: width .12s linear;
}
.ppv-preview-progress-bar-indeterminate {
  width: 35%;
  animation: ppv-progress 1s ease-in-out infinite;
}
@keyframes ppv-progress {
  from { transform: translateX(-110%); }
  to { transform: translateX(300%); }
}
.ppv-toast-container {
  position: fixed;
  z-index: 2147483647;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.ppv-toast {
  max-width: 360px;
  padding: 10px 14px;
  border-radius: 6px;
  color: #fff;
  background: #333;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .25);
  font: 14px/1.4 Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  opacity: 1;
  transition: opacity .3s, transform .3s;
}
.ppv-toast-info { background: #0096fa; }
.ppv-toast-success { background: #00a878; }
.ppv-toast-error { background: #d64242; }
.ppv-toast-leave { opacity: 0; transform: translateY(-6px); }
.ppv-settings-backdrop {
  position: fixed;
  z-index: 2147483647;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .55);
  font-family: Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
.ppv-settings-backdrop.is-open { display: flex; }
.ppv-settings-panel {
  box-sizing: border-box;
  width: min(420px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid #4a4a4a;
  border-radius: 10px;
  color: #f4f4f4;
  background: #242424;
  box-shadow: 0 16px 50px rgba(0, 0, 0, .45);
}
.ppv-settings-form { display: contents; }
.ppv-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #3d3d3d;
  font-size: 17px;
}
.ppv-settings-close {
  padding: 2px 8px;
  border: 0;
  color: #bbb;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}
.ppv-settings-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}
.ppv-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #ddd;
  font-size: 14px;
}
.ppv-settings-checkbox-row { justify-content: flex-start; }
.ppv-settings-row input[type="number"],
.ppv-settings-row select {
  box-sizing: border-box;
  width: 150px;
  padding: 7px 9px;
  border: 1px solid #555;
  border-radius: 5px;
  color: #fff;
  background: #181818;
  font: inherit;
}
.ppv-settings-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #0096fa;
}
.ppv-settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #3d3d3d;
}
.ppv-settings-actions button {
  padding: 8px 14px;
  border: 0;
  border-radius: 5px;
  color: #eee;
  background: #484848;
  font: 14px/1.2 inherit;
  cursor: pointer;
}
.ppv-settings-actions .ppv-settings-save {
  color: #fff;
  background: #0096fa;
}
`;
  function injectStyle() {
    const element = document.createElement("style");
    element.textContent = style;
    document.head.append(element);
  }

  // ../../node_modules/@zip.js/zip.js/lib/zip-core-base.js
  init_configuration();

  // ../../node_modules/@zip.js/zip.js/lib/core/codec-worker-web.js
  init_constants();
  init_array();
  init_error();
  init_codec_stream();
  init_codec_worker();
  var MODULE_WORKER_OPTIONS = { type: "module" };
  var ERROR_EVENT_TYPE = "error";
  var MESSAGE_ERROR_EVENT_TYPE = "messageerror";
  var ABORT_EVENT_TYPE = "abort";
  var webWorkerSource;
  var webWorkerURI;
  var webWorkerOptions;
  var transferStreamsSupported = true;
  try {
    transferStreamsSupported = typeof structuredClone == FUNCTION_TYPE && structuredClone(new DOMException("", "AbortError")).code !== UNDEFINED_VALUE;
  } catch {
  }
  setWebWorkerBackend(createWebWorkerInterface);
  function createWebWorkerInterface(workerData, config2) {
    const { baseURI, chunkSize, workerStartupTimeout } = config2;
    let { wasmURI } = config2;
    if (!workerData.interface) {
      if (typeof wasmURI == FUNCTION_TYPE) {
        wasmURI = wasmURI();
      }
      let worker;
      try {
        worker = getWebWorker(workerData.workerURI, baseURI, workerData);
      } catch {
        disableWebWorker(workerData);
        return createWorkerInterface(workerData, config2);
      }
      Object.assign(workerData, {
        worker,
        workerAlive: false,
        terminated: false,
        startupError: null,
        interface: {
          run: async () => {
            try {
              return await runWebWorker(workerData, { chunkSize, wasmURI, baseURI, workerStartupTimeout });
            } catch (error) {
              if (error && error.workerStartupFailed) {
                disableWebWorker(workerData);
                releaseWorkerStreams(workerData);
                return runWorker(workerData, config2);
              }
              if (error && error.codecImportFailed) {
                if (workerData.reader) {
                  releaseWorkerStreams(workerData);
                  return runWorker(workerData, config2);
                }
                workerData.onTaskFinished();
              }
              throw error;
            }
          }
        }
      });
    }
    return workerData.interface;
  }
  async function runWebWorker(workerData, config2) {
    if (!workerData.worker) {
      const { startupError } = workerData;
      workerData.startupError = null;
      const error = startupError || new Error(ERR_WORKER_STARTUP_TIMEOUT);
      error.workerStartupFailed = true;
      throw error;
    }
    let resolveResult, rejectResult;
    const result = new Promise((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = (error) => {
        const { outputSize, workerOptions } = workerData;
        workerOptions.outputSize = outputSize;
        if (isErrorObject(error)) {
          try {
            error.outputSize = outputSize;
          } catch {
          }
        }
        reject(error);
      };
    });
    Object.assign(workerData, {
      reader: null,
      writer: null,
      outputSize: 0,
      destinationFailed: false,
      destinationError: null,
      resolveResult,
      rejectResult,
      result
    });
    const { readable, options } = workerData;
    const { writable, closed, abortPipe } = watchClosedStream(workerData.writable, workerData);
    let streamsTransferred;
    try {
      streamsTransferred = sendMessage({
        type: MESSAGE_START,
        options,
        config: config2,
        readable,
        writable
      }, workerData);
    } catch (error) {
      abortPipe();
      try {
        await closed;
      } catch {
      }
      workerData.onTaskFinished();
      throw error;
    }
    if (!streamsTransferred) {
      Object.assign(workerData, {
        reader: readable.getReader(),
        writer: writable.getWriter()
      });
    }
    const { workerStartupTimeout } = config2;
    if (!workerData.workerAlive && Number.isFinite(workerStartupTimeout) && workerStartupTimeout >= 0) {
      workerData.startupTimeout = setTimeout(() => onStartupTimeout(workerData), workerStartupTimeout);
    }
    try {
      const resultValue = await result;
      await closeWritable();
      await closed;
      return resultValue;
    } catch (error) {
      await closeWritable();
      abortPipe();
      try {
        await closed;
      } catch {
      }
      const { outputSize, workerOptions, destinationFailed, destinationError } = workerData;
      workerOptions.outputSize = outputSize;
      const workerFailed = isErrorObject(error) && (error.codecImportFailed || error.workerStartupFailed);
      const reportedError = destinationFailed && !workerFailed ? destinationError : error;
      if (isErrorObject(reportedError)) {
        try {
          reportedError.outputSize = outputSize;
        } catch {
        }
      }
      throw reportedError;
    }
    async function closeWritable() {
      if (!streamsTransferred && !writable.locked) {
        try {
          await writable.getWriter().close();
        } catch {
        }
      }
    }
  }
  function watchClosedStream(writableSource, workerData) {
    const abortController = new AbortController();
    let aborting;
    const { writable, readable } = new TransformStream({
      transform(chunk, controller) {
        workerData.outputSize += chunk.length;
        controller.enqueue(chunk);
      }
    });
    const closed = readable.pipeTo(writableSource, { preventClose: true, preventAbort: true, signal: abortController.signal });
    closed.catch((error) => {
      if (!aborting) {
        Object.assign(workerData, { destinationFailed: true, destinationError: error });
      }
    });
    const { signal } = workerData.workerOptions.streamOptions;
    if (signal) {
      const onAbort = () => abortController.abort(signal.reason);
      const removeAbortListener = () => signal.removeEventListener(ABORT_EVENT_TYPE, onAbort);
      signal.addEventListener(ABORT_EVENT_TYPE, onAbort);
      closed.then(removeAbortListener, removeAbortListener);
    }
    return {
      writable,
      closed,
      abortPipe: () => {
        aborting = true;
        abortController.abort();
      }
    };
  }
  function releaseWorkerStreams(workerData) {
    const { reader } = workerData;
    if (reader) {
      reader.releaseLock();
    }
    workerData.reader = null;
    workerData.writer = null;
  }
  function terminateWorker(workerData) {
    const { worker } = workerData;
    if (worker) {
      try {
        worker.terminate();
      } catch {
      }
    }
    workerData.interface = null;
  }
  function getWebWorker(url, baseURI, workerData, isModuleType, useBlobURI = true) {
    const { createWorker } = workerData;
    let worker, resolvedURI, resolvedOptions;
    if (createWorker) {
      worker = createWorker();
    } else if (webWorkerURI === UNDEFINED_VALUE || webWorkerSource !== url) {
      const isFunctionURI = typeof url == FUNCTION_TYPE;
      if (isFunctionURI) {
        resolvedURI = url(useBlobURI);
      } else {
        resolvedURI = url;
      }
      const isDataURI = resolvedURI.startsWith("data:");
      const isBlobURI = resolvedURI.startsWith("blob:");
      if (isDataURI || isBlobURI) {
        if (isModuleType === UNDEFINED_VALUE) {
          isModuleType = false;
        }
        if (isModuleType) {
          resolvedOptions = MODULE_WORKER_OPTIONS;
        }
        try {
          worker = new Worker(resolvedURI, resolvedOptions);
        } catch (error) {
          if (isBlobURI) {
            try {
              URL.revokeObjectURL(resolvedURI);
            } catch {
            }
          }
          if (isFunctionURI && isBlobURI) {
            return getWebWorker(url, baseURI, workerData, isModuleType, false);
          } else if (!isModuleType) {
            return getWebWorker(url, baseURI, workerData, true, false);
          } else {
            throw error;
          }
        }
      } else {
        if (isModuleType === UNDEFINED_VALUE) {
          isModuleType = true;
        }
        if (isModuleType) {
          resolvedOptions = MODULE_WORKER_OPTIONS;
        }
        try {
          resolvedURI = new URL(resolvedURI, baseURI);
        } catch {
        }
        try {
          worker = new Worker(resolvedURI, resolvedOptions);
        } catch (error) {
          if (isModuleType) {
            return getWebWorker(url, baseURI, workerData, false, useBlobURI);
          } else {
            throw error;
          }
        }
      }
      webWorkerSource = url;
      webWorkerURI = resolvedURI;
      webWorkerOptions = resolvedOptions;
    } else {
      worker = new Worker(webWorkerURI, webWorkerOptions);
    }
    worker.addEventListener(MESSAGE_EVENT_TYPE, (event) => {
      workerData.workerAlive = true;
      clearStartupTimeout(workerData);
      onMessage(event, workerData);
    });
    worker.addEventListener(ERROR_EVENT_TYPE, (event) => onWorkerError(event, workerData));
    worker.addEventListener(MESSAGE_ERROR_EVENT_TYPE, (event) => onWorkerError(event, workerData));
    return worker;
  }
  function onStartupTimeout(workerData) {
    workerData.startupTimeout = null;
    if (workerData.workerAlive) {
      return;
    }
    const { rejectResult, writer } = workerData;
    terminateWorker(workerData);
    workerData.worker = null;
    if (rejectResult) {
      const error = new Error(ERR_WORKER_STARTUP_TIMEOUT);
      error.workerStartupFailed = true;
      rejectResult(error);
      if (writer) {
        writer.releaseLock();
      }
    }
  }
  function clearStartupTimeout(workerData) {
    const { startupTimeout } = workerData;
    if (startupTimeout) {
      clearTimeout(startupTimeout);
      workerData.startupTimeout = null;
    }
  }
  function onWorkerError(event, workerData) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    clearStartupTimeout(workerData);
    const { workerAlive, rejectResult, writer, onTaskFinished } = workerData;
    terminateWorker(workerData);
    if (!workerAlive) {
      workerData.worker = null;
    }
    let error = event.error || new Error(event.message || ERROR_EVENT_TYPE);
    if (!workerAlive) {
      error = Object.assign(new Error(error.message || ERROR_EVENT_TYPE), { workerStartupFailed: true });
      workerData.startupError = error;
    }
    if (rejectResult) {
      rejectResult(error);
      if (writer) {
        writer.releaseLock();
      }
      if (workerAlive) {
        onTaskFinished();
      }
    }
  }
  function sendMessage(message, { worker, writer, transferStreams, workerAlive }) {
    try {
      const { value, readable, writable } = message;
      const transferables = [];
      if (value) {
        message.value = toExactUint8Array(value);
        transferables.push(message.value.buffer);
      }
      if (transferStreams && transferStreamsSupported && workerAlive) {
        if (readable) {
          transferables.push(readable);
        }
        if (writable) {
          transferables.push(writable);
        }
      } else {
        message.readable = message.writable = null;
      }
      if (transferables.length) {
        try {
          worker.postMessage(message, transferables);
          return true;
        } catch {
          transferStreamsSupported = false;
          message.readable = message.writable = null;
          worker.postMessage(message);
        }
      } else {
        worker.postMessage(message);
      }
    } catch (error) {
      if (writer) {
        writer.releaseLock();
      }
      throw error;
    }
  }
  async function onMessage({ data }, workerData) {
    const { type, value, messageId, result, error, errorValue } = data;
    const { reader, writer, resolveResult, rejectResult, onTaskFinished, generation } = workerData;
    const stale = () => workerData.generation != generation;
    try {
      if (error) {
        fail(getResponseError(error, errorValue));
      } else {
        if (type == MESSAGE_PULL) {
          const { value: value2, done } = await reader.read();
          if (!stale()) {
            sendMessage({ type: MESSAGE_DATA, value: value2, done, messageId }, workerData);
          }
        }
        if (type == MESSAGE_DATA) {
          const chunk = new Uint8Array(value);
          await writer.ready;
          await writer.write(chunk);
          if (!stale()) {
            sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
          }
        }
        if (type == MESSAGE_CLOSE) {
          succeed(result);
        }
      }
    } catch (error2) {
      if (!stale()) {
        terminateWorker(workerData);
        fail(error2);
      }
    }
    function fail(error2) {
      if (!stale()) {
        rejectResult(error2);
        releaseWriter();
        if (!(isErrorObject(error2) && error2.codecImportFailed)) {
          onTaskFinished();
        }
      }
    }
    function succeed(result2) {
      if (!stale()) {
        resolveResult(result2);
        releaseWriter();
        onTaskFinished();
      }
    }
    function releaseWriter() {
      if (writer) {
        writer.releaseLock();
      }
    }
  }
  function getResponseError(errorData, errorValue) {
    const { message, stack, code, name, outputSize, cause, codecImportFailed } = errorData;
    let responseError;
    if (errorValue) {
      responseError = errorValue.value;
    } else {
      responseError = Object.assign(new Error(message), { stack, code, name });
    }
    if (isErrorObject(responseError)) {
      try {
        if (outputSize !== UNDEFINED_VALUE) {
          responseError.outputSize = outputSize;
        }
        if (codecImportFailed) {
          responseError.codecImportFailed = true;
        }
        if (cause) {
          if (!isErrorObject(responseError.cause)) {
            responseError.cause = Object.assign(new Error(cause.message), { name: cause.name });
          }
          if (cause.code !== UNDEFINED_VALUE && responseError.cause.code !== cause.code) {
            responseError.cause.code = cause.code;
          }
        }
        if (errorValue) {
          if (responseError.name !== name) {
            responseError.name = name;
          }
          if (responseError.code !== code) {
            responseError.code = code;
          }
        }
      } catch {
      }
    }
    return responseError;
  }

  // ../../node_modules/@zip.js/zip.js/lib/zip-core-reader.js
  init_zip_reader();

  // ../../node_modules/@zip.js/zip.js/lib/core/zip-writer.js
  init_constants();
  init_configuration();
  init_codec_registry();
  init_codec_worker();
  init_codec_pool();
  init_io();
  init_encode_text();
  init_array();
  init_warnings();
  init_compatible_streams();
  init_error();
  init_zip_entry();
  init_options();
  var ERR_DUPLICATED_NAME = "File already exists";
  var ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
  var ERR_INVALID_COMMENT_TYPE = "Invalid zip file comment (must be a Uint8Array)";
  var ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
  var ERR_INVALID_ENTRY_COMMENT_TYPE = "Invalid file entry comment (must be a string)";
  var ERR_INVALID_DATE = "Invalid date (must be a valid Date instance)";
  var ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
  var ERR_INVALID_VERSION = "Version exceeds 65535";
  var ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
  var ERR_UNSUPPORTED_ENCRYPTION_USDZ = "Encryption is not supported in USDZ files";
  var ERR_UNSUPPORTED_SPLIT_USDZ = "Split zip files are not supported in USDZ files";
  var ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH = "Encryption is not supported when the 'passThrough' option is set to true (use 'compressed' instead)";
  var ERR_INVALID_EXTRAFIELD = "Invalid extra field (must be a Map)";
  var ERR_INVALID_EXTRAFIELD_TYPE = "Invalid extra field type (must be integer 0..65535)";
  var ERR_INVALID_EXTRAFIELD_DATA_TYPE = "Invalid extra field data (must be a Uint8Array)";
  var ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
  var MIN_UNIX_TIME = -2147483648;
  var MAX_UNIX_TIME = 2147483647;
  var MIN_NTFS_TIME = BigInt(0);
  var MAX_NTFS_TIME = BigInt("0x7fffffffffffffff");
  var ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (set the 'zip64' option to 'true')";
  var ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
  var ERR_UNDEFINED_COMPRESSION_METHOD = "Undefined compression method";
  var ERR_UNDEFINED_CRC32 = "Undefined CRC32";
  var ERR_UNDEFINED_READER = "Undefined reader";
  var ERR_INVALID_READER = "Invalid reader (must be a Reader instance, a ReadableStream instance, or an object with a 'readable' property)";
  var ERR_ZIP_NOT_EMPTY = "Zip file not empty";
  var ERR_INVALID_UID = "Invalid uid (must be integer 0..2^32-1)";
  var ERR_INVALID_GID = "Invalid gid (must be integer 0..2^32-1)";
  var ERR_INVALID_UNIX_MODE = "Invalid UNIX mode (must be integer 0..65535)";
  var ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = "Invalid unixExtraFieldType (must be 'infozip' or 'unix')";
  var ERR_INVALID_UNIX_ID_SIZE = "uid/gid must be 0..65535 for unixExtraFieldType 'unix' (use 'infozip' for larger ids)";
  var ERR_INVALID_MSDOS_ATTRIBUTES = "Invalid msdosAttributesRaw (must be integer 0..255)";
  var ERR_INVALID_MSDOS_DATA = "Invalid msdosAttributes (must be an object with boolean flags)";
  var ERR_INVALID_LEVEL = "Invalid level (must be integer 0..9)";
  var ERR_INVALID_SIGNATURE_DATA = "Signature data exceeds 64KB";
  var ERR_INVALID_ENTRY = "Invalid entry option (must be an entry returned by ZipReader#getEntries())";
  var ERR_ZIP_CRYPTO_LAST_MOD_DATE = "The last modification date of an entry encrypted with ZipCrypto cannot be changed when passThrough is set";
  var WARNING_COMPRESSION_UNAVAILABLE = "compression unavailable";
  var WARNING_CLAMPED_LAST_MODIFICATION_DATE = "clamped last modification date";
  var EXTRAFIELD_DATA_AES = new Uint8Array([7, 0, 2, 0, 65, 69, 3, 0, 0]);
  var EXTRAFIELD_OFFSET_AES_VENDOR_VERSION = 4;
  var EXTRAFIELD_OFFSET_AES_COMPRESSION_METHOD = 9;
  var EXTRAFIELD_USDZ_MAX_LENGTH = 67;
  var MIN_PRINTABLE_ASCII_CHARACTER_CODE = 32;
  var MAX_PRINTABLE_ASCII_CHARACTER_CODE = 126;
  var VENDOR_VERSION_AE_12 = 1;
  var INFOZIP_EXTRA_FIELD_TYPE = "infozip";
  var UNIX_EXTRA_FIELD_TYPE = "unix";
  var LEVEL_BY_BITFLAG_LEVEL = [8, 9, 5, 3];
  var MAX_LEVEL = 9;
  var workers = 0;
  var pendingEntries = [];
  var ZipWriter = class {
    constructor(writer, options = {}) {
      writer = new GenericWriter(writer);
      const { availableSize = INFINITY_VALUE, maxSize = INFINITY_VALUE } = writer;
      const addSplitZipSignature = availableSize > 0 && availableSize !== INFINITY_VALUE && maxSize > 0 && maxSize !== INFINITY_VALUE;
      if (addSplitZipSignature && options[OPTION_USDZ]) {
        throw new Error(ERR_UNSUPPORTED_SPLIT_USDZ);
      }
      Object.assign(this, {
        writer,
        addSplitZipSignature,
        options,
        fileEntries: /* @__PURE__ */ new Map(),
        filenames: /* @__PURE__ */ new Set(),
        offset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? writer.size || writer.writable.size || 0 : options[OPTION_OFFSET],
        initialOffset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? 0 : options[OPTION_OFFSET] - (writer.size || writer.writable.size || 0),
        pendingAddFileCalls: /* @__PURE__ */ new Set(),
        pendingErrors: [],
        warnings: [],
        bufferedWrites: 0,
        directWrites: 0,
        lastFileEntry: UNDEFINED_VALUE,
        archiveClosed: false
      });
    }
    prependZip(reader) {
      return watchPromiseError(this, prependZipEntries(this, reader));
    }
    appendZip(reader) {
      return watchPromiseError(this, this.appendZipEntries(reader));
    }
    async appendZipEntries(reader) {
      const zipWriter = this;
      const { pendingAddFileCalls, filenames, fileEntries } = zipWriter;
      while (pendingAddFileCalls.size) {
        await Promise.allSettled(Array.from(pendingAddFileCalls));
      }
      let resolveAppendZip;
      const promiseAppendZip = new Promise((resolve) => resolveAppendZip = resolve);
      pendingAddFileCalls.add(promiseAppendZip);
      const appendedFilenames = [];
      let releaseLockWriter;
      try {
        reader = new GenericReader(reader);
        await initStream(reader);
        if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
          reader = new BlobReader(await streamToBlob(reader.readable));
          await initStream(reader);
        }
        const { ZipReader: ZipReader2 } = await Promise.resolve().then(() => (init_zip_reader(), zip_reader_exports));
        const zipReader = new ZipReader2(reader);
        const entries = await zipReader.getEntries();
        await zipReader.close();
        await initStream(zipWriter.writer);
        const { directoryOffset } = zipReader;
        entries.forEach(({ filename }) => {
          if (filenames.has(filename)) {
            throw new Error(ERR_DUPLICATED_NAME);
          }
          filenames.add(filename);
          appendedFilenames.push(filename);
        });
        zipWriter.writerLocked = true;
        const { lockWriter } = zipWriter;
        zipWriter.lockWriter = new Promise((resolve) => releaseLockWriter = () => {
          zipWriter.writerLocked = false;
          resolve();
        });
        await lockWriter;
        if (zipWriter.addSplitZipSignature) {
          delete zipWriter.addSplitZipSignature;
          if (!await startsWithSplitZipSignature2(reader)) {
            await writeData(zipWriter.writer, getSplitZipSignatureArray());
            zipWriter.offset += SPLIT_ZIP_FILE_SIGNATURE_LENGTH;
          }
        }
        const entryPositions = await copyZipData(zipWriter, reader, entries, directoryOffset);
        entries.forEach((entry) => {
          const {
            version,
            rawLastModDate,
            rawFilename,
            bitFlag,
            encrypted,
            uncompressedSize,
            compressedSize,
            extraFieldZip64
          } = entry;
          let {
            compressionMethod,
            rawExtraField
          } = entry;
          const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
          rawExtraField = removeExtraFieldZip64(rawExtraField || EMPTY_UINT8_ARRAY);
          if (entry.extraFieldAES) {
            compressionMethod = COMPRESSION_METHOD_AES;
          }
          const extraFieldLength = getLength(rawExtraField);
          const zip64UncompressedSize = Boolean(extraFieldZip64) && extraFieldZip64.uncompressedSize !== UNDEFINED_VALUE;
          const zip64CompressedSize = Boolean(extraFieldZip64) && extraFieldZip64.compressedSize !== UNDEFINED_VALUE;
          const bitFlagValue = getBitFlag(level, languageEncodingFlag, dataDescriptor, encrypted, compressionMethod) & ~BITFLAG_LEVEL | level << 1;
          const {
            headerArray,
            headerView
          } = getHeaderArrayData({
            version,
            bitFlag: bitFlagValue,
            compressionMethod,
            uncompressedSize,
            compressedSize,
            rawLastModDate,
            rawFilename,
            zip64CompressedSize,
            zip64UncompressedSize,
            extraFieldLength
          });
          const { crc32 } = entry;
          if (crc32 !== UNDEFINED_VALUE) {
            setUint32(headerView, HEADER_OFFSET_SIGNATURE, crc32);
          }
          const { offset, diskNumberStart } = entryPositions.get(entry);
          Object.assign(entry, {
            zip64Enabled: true,
            zip64UncompressedSize,
            zip64CompressedSize,
            offset,
            diskNumberStart,
            zip64DiskNumberStart: false,
            rawExtraFieldZip64: EMPTY_UINT8_ARRAY,
            rawExtraFieldAES: EMPTY_UINT8_ARRAY,
            rawExtraFieldExtendedTimestamp: EMPTY_UINT8_ARRAY,
            rawExtraFieldNTFS: EMPTY_UINT8_ARRAY,
            rawExtraFieldUnix: EMPTY_UINT8_ARRAY,
            rawExtraField,
            rawCentralExtraField: EMPTY_UINT8_ARRAY,
            headerArray,
            headerView
          });
          fileEntries.set(entry.filename, entry);
        });
      } catch (error) {
        appendedFilenames.forEach((filename) => filenames.delete(filename));
        throw error;
      } finally {
        resolveAppendZip();
        pendingAddFileCalls.delete(promiseAppendZip);
        if (releaseLockWriter) {
          releaseLockWriter();
        }
      }
    }
    add(name = "", reader, options = {}) {
      const zipWriter = this;
      const { pendingAddFileCalls } = zipWriter;
      const promiseAddFile = addFileEntry(zipWriter, name, reader, options);
      pendingAddFileCalls.add(promiseAddFile);
      const deletePendingAddFileCall = () => pendingAddFileCalls.delete(promiseAddFile);
      Promise.prototype.then.call(promiseAddFile, deletePendingAddFileCall, deletePendingAddFileCall);
      return watchPromiseError(zipWriter, promiseAddFile);
    }
    remove(entry) {
      const { filenames, fileEntries } = this;
      if (typeof entry == STRING_TYPE) {
        entry = fileEntries.get(entry);
      }
      if (entry && entry.filename !== UNDEFINED_VALUE) {
        const { filename } = entry;
        if (filenames.has(filename) && fileEntries.has(filename)) {
          filenames.delete(filename);
          fileEntries.delete(filename);
          return true;
        }
      }
      return false;
    }
    async close(comment = EMPTY_UINT8_ARRAY, options = {}) {
      const zipWriter = this;
      const { pendingAddFileCalls, writer } = this;
      const { writable } = writer;
      if (zipWriter.archiveClosed) {
        return getWriterData(writer);
      }
      if (!(comment instanceof Uint8Array)) {
        throw new Error(ERR_INVALID_COMMENT_TYPE);
      }
      if (getLength(comment) > MAX_16_BITS) {
        throw new Error(ERR_INVALID_COMMENT);
      }
      while (pendingAddFileCalls.size) {
        await Promise.allSettled(Array.from(pendingAddFileCalls));
      }
      await Promise.allSettled(zipWriter.pendingErrors.map((watcher) => watcher.recorded));
      const unobservedWatchers = zipWriter.pendingErrors.filter((watcher) => watcher.failed && !watcher.observed);
      if (unobservedWatchers.length) {
        const unobservedErrors = unobservedWatchers.map((watcher) => watcher.error);
        unobservedWatchers.forEach((watcher) => watcher.observed = true);
        const [error] = unobservedErrors;
        try {
          error.entryErrors = unobservedErrors;
        } catch {
        }
        throw error;
      }
      await closeFile(zipWriter, comment, options);
      zipWriter.archiveClosed = true;
      const preventClose = !ownsWritable(writer) && getOptionValue2(zipWriter, options, OPTION_PREVENT_CLOSE);
      if (!preventClose) {
        await writable.getWriter().close();
      }
      return getWriterData(writer);
    }
    [SYMBOL_ASYNC_DISPOSE]() {
      return this.close();
    }
  };
  var WatchedPromise = class extends Promise {
    then(onFulfilled, onRejected) {
      const { watcher } = this;
      if (watcher) {
        watcher.observed = true;
      }
      return super.then(onFulfilled, onRejected);
    }
  };
  function getWriterData(writer) {
    return writer.getData ? writer.getData() : writer.writable;
  }
  function watchPromiseError(zipWriter, promise) {
    const watchedPromise = new WatchedPromise((resolve, reject) => Promise.prototype.then.call(promise, resolve, reject));
    const watcher = {};
    watchedPromise.watcher = watcher;
    watcher.recorded = Promise.prototype.then.call(
      watchedPromise,
      UNDEFINED_VALUE,
      (error) => Object.assign(watcher, { failed: true, error })
    );
    zipWriter.pendingErrors.push(watcher);
    return watchedPromise;
  }
  async function prependZipEntries(zipWriter, reader) {
    if (zipWriter.filenames.size) {
      throw new Error(ERR_ZIP_NOT_EMPTY);
    }
    await zipWriter.appendZipEntries(reader);
  }
  async function addFileEntry(zipWriter, name, reader, options) {
    options = Object.assign({}, options);
    const entry = options[OPTION_ENTRY];
    if (entry !== UNDEFINED_VALUE) {
      const { entryOptions, passThroughOptions } = getSourceEntryOptions(
        entry,
        checkPassThroughOption(getOptionValue2(zipWriter, options, OPTION_PASS_THROUGH)),
        getOptionValue2(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE)
      );
      delete options[OPTION_ENTRY];
      options = Object.assign(entryOptions, passThroughOptions, options);
    }
    if (getOptionValue2(zipWriter, options, PROPERTY_NAME_DIRECTORY) && !name.endsWith(DIRECTORY_SIGNATURE)) {
      name += DIRECTORY_SIGNATURE;
    }
    if (zipWriter.filenames.has(name)) {
      throw new Error(ERR_DUPLICATED_NAME);
    }
    zipWriter.filenames.add(name);
    if (workers < getConfiguration().maxWorkers) {
      workers++;
    } else {
      await new Promise((resolve) => pendingEntries.push(resolve));
    }
    try {
      return await addFile(zipWriter, name, reader, options);
    } catch (error) {
      zipWriter.filenames.delete(name);
      throw error;
    } finally {
      const pendingEntry = pendingEntries.shift();
      if (pendingEntry) {
        pendingEntry();
      } else {
        workers--;
      }
    }
  }
  async function addFile(zipWriter, name, reader, options) {
    const attributesInfo = resolveAttributes(zipWriter, name, options);
    ({ name } = attributesInfo);
    const metadataInfo = resolveMetadata(zipWriter, name, options);
    const { comment } = metadataInfo;
    const extraField = options[PROPERTY_NAME_EXTRA_FIELD];
    zipWriter.fileEntries.set(name, UNDEFINED_VALUE);
    const previousFileEntry = zipWriter.lastFileEntry;
    const pendingFileEntry = {};
    let releaseLockFileEntry;
    if (metadataInfo.resolvedOptions.keepOrder) {
      pendingFileEntry.lockFileEntry = new Promise((resolve) => releaseLockFileEntry = resolve);
    }
    zipWriter.lastFileEntry = pendingFileEntry;
    let fileEntry;
    try {
      const { resolvedOptions } = metadataInfo;
      if (resolvedOptions.level != 0 && resolvedOptions.compressionMethod === UNDEFINED_VALUE && !resolvedOptions.passThroughCompression && !await supportsDeflate(getConfiguration())) {
        resolvedOptions.level = 0;
        addWarning(zipWriter.warnings, WARNING_COMPRESSION_UNAVAILABLE, name);
      }
      const sizesInfo = await resolveSizes(zipWriter, reader, metadataInfo, options);
      ({ reader } = sizesInfo);
      const diskOffset = getDiskOffset2(zipWriter.writer);
      const diskNumber = getDiskNumber(zipWriter.writer);
      let crc32 = options.crc32 === UNDEFINED_VALUE ? options[PROPERTY_NAME_SIGNATURE] : options.crc32;
      const storesAE2 = sizesInfo.resolvedOptions.encrypted && !resolvedOptions.zipCrypto;
      if (resolvedOptions.passThroughCompression && !resolvedOptions.passThroughEncryption && storesAE2) {
        crc32 = UNDEFINED_VALUE;
      }
      if (resolvedOptions.passThroughCompression && reader && !storesAE2 && crc32 === UNDEFINED_VALUE) {
        throw new Error(ERR_UNDEFINED_CRC32);
      }
      options = Object.assign({}, options, attributesInfo.resolvedOptions, metadataInfo.resolvedOptions, sizesInfo.resolvedOptions, {
        signature: options[PROPERTY_NAME_SIGNATURE],
        crc32,
        offset: zipWriter.offset - diskOffset,
        diskNumberStart: diskNumber,
        [OPTION_USDZ]: zipWriter.options[OPTION_USDZ]
      });
      const headerInfo = getHeaderInfo(options);
      if (headerInfo.lastModDateClamped) {
        addWarning(zipWriter.warnings, WARNING_CLAMPED_LAST_MODIFICATION_DATE, name);
      }
      const dataDescriptorInfo = getDataDescriptorInfo(options);
      const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
      fileEntry = await getFileEntry(zipWriter, name, reader, {
        headerInfo,
        dataDescriptorInfo,
        metadataSize,
        fileEntry: pendingFileEntry,
        previousFileEntry,
        releaseLockFileEntry
      }, options);
    } catch (error) {
      zipWriter.fileEntries.delete(name);
      throw error;
    } finally {
      if (releaseLockFileEntry) {
        releaseLockFileEntry(previousFileEntry && previousFileEntry.lockFileEntry);
      }
    }
    Object.assign(fileEntry, {
      name,
      comment,
      extraField
    });
    return new Entry(fileEntry);
  }
  function getSourceEntryOptions(entry, passThrough, lastModDateOverride) {
    if (entry === null || typeof entry != OBJECT_TYPE || Array.isArray(entry)) {
      throw new Error(ERR_INVALID_ENTRY);
    }
    const {
      externalFileAttributes,
      versionMadeBy,
      comment,
      lastModDate,
      rawLastModDate,
      creationDate,
      lastAccessDate,
      uncompressedSize,
      encrypted,
      zipCrypto,
      crc32,
      compressionMethod,
      extraFieldAES,
      extraFieldUnix,
      internalFileAttributes,
      extraField,
      bitFlag,
      directory,
      uid,
      gid
    } = entry;
    const entryOptions = {
      externalFileAttributes,
      versionMadeBy,
      comment,
      lastModDate,
      creationDate,
      lastAccessDate,
      internalFileAttributes,
      directory
    };
    if (bitFlag && bitFlag.languageEncodingFlag) {
      entryOptions[OPTION_USE_UNICODE_FILE_NAMES] = true;
    }
    const userExtraField = getUserExtraField(extraField);
    if (userExtraField) {
      entryOptions[PROPERTY_NAME_EXTRA_FIELD] = userExtraField;
    }
    if (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE) {
      Object.assign(entryOptions, {
        uid,
        gid,
        unixExtraFieldType: extraFieldUnix ? UNIX_EXTRA_FIELD_TYPE : INFOZIP_EXTRA_FIELD_TYPE
      });
    }
    const passThroughOptions = {};
    if (passThrough && !directory) {
      Object.assign(passThroughOptions, {
        uncompressedSize,
        crc32,
        compressionMethod
      });
      if (passThrough !== PASS_THROUGH_COMPRESSED) {
        Object.assign(passThroughOptions, {
          encrypted,
          zipCrypto,
          encryptionStrength: extraFieldAES ? extraFieldAES.strength : UNDEFINED_VALUE
        });
      }
      if (bitFlag) {
        passThroughOptions.dataDescriptor = bitFlag.dataDescriptor;
        passThroughOptions[OPTION_LEVEL] = LEVEL_BY_BITFLAG_LEVEL[bitFlag.level];
      }
      if (lastModDateOverride === UNDEFINED_VALUE) {
        passThroughOptions.rawLastModDate = rawLastModDate;
      } else if (passThrough !== PASS_THROUGH_COMPRESSED && zipCrypto && (!bitFlag || bitFlag.dataDescriptor) && lastModDateOverride instanceof Date && getDosTimeHighByte(lastModDateOverride) != (rawLastModDate >>> 8 & MAX_8_BITS)) {
        throw new Error(ERR_ZIP_CRYPTO_LAST_MOD_DATE);
      }
    }
    return { entryOptions, passThroughOptions };
  }
  function getDosTimeHighByte(lastModDate) {
    let dosLastModDate = new Date(Math.ceil(Math.floor(lastModDate.getTime() / 1e3) / 2) * 2e3);
    if (dosLastModDate < MIN_DATE) {
      dosLastModDate = MIN_DATE;
    } else if (dosLastModDate > MAX_DATE) {
      dosLastModDate = MAX_DATE;
    }
    return (dosLastModDate.getHours() << 3 | dosLastModDate.getMinutes() >> 3) & MAX_8_BITS;
  }
  function resolveAttributes(zipWriter, name, options) {
    let msDosCompatible = getOptionValue2(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
    let versionMadeBy = getOptionValue2(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? VERSION_MADE_BY_MSDOS : VERSION_MADE_BY_UNIX);
    const executable = getOptionValue2(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
    const uid = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_UID);
    const gid = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_GID);
    let unixMode = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_UNIX_MODE);
    let unixExtraFieldType = getOptionValue2(zipWriter, options, OPTION_UNIX_EXTRA_FIELD_TYPE);
    let setuid = getOptionValue2(zipWriter, options, PROPERTY_NAME_SETUID);
    let setgid = getOptionValue2(zipWriter, options, PROPERTY_NAME_SETGID);
    let sticky = getOptionValue2(zipWriter, options, PROPERTY_NAME_STICKY);
    checkIntegerOption(uid, MAX_32_BITS, ERR_INVALID_UID);
    checkIntegerOption(gid, MAX_32_BITS, ERR_INVALID_GID);
    checkIntegerOption(unixMode, MAX_16_BITS, ERR_INVALID_UNIX_MODE);
    if (unixExtraFieldType !== UNDEFINED_VALUE && unixExtraFieldType !== INFOZIP_EXTRA_FIELD_TYPE && unixExtraFieldType !== UNIX_EXTRA_FIELD_TYPE) {
      throw new Error(ERR_INVALID_UNIX_EXTRA_FIELD_TYPE);
    }
    if (unixExtraFieldType === UNIX_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE && uid > MAX_16_BITS || gid !== UNDEFINED_VALUE && gid > MAX_16_BITS)) {
      throw new Error(ERR_INVALID_UNIX_ID_SIZE);
    }
    if (unixExtraFieldType === UNDEFINED_VALUE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
      unixExtraFieldType = INFOZIP_EXTRA_FIELD_TYPE;
    }
    let msdosAttributesRaw = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW);
    let msdosAttributes = getOptionValue2(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES);
    const hasUnixMetadata = uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE || unixMode !== UNDEFINED_VALUE || unixExtraFieldType || executable;
    const hasMsDosProvided = msdosAttributesRaw !== UNDEFINED_VALUE || msdosAttributes !== UNDEFINED_VALUE;
    if (hasUnixMetadata) {
      msDosCompatible = false;
      versionMadeBy = versionMadeBy & MAX_8_BITS | VERSION_MADE_BY_UNIX;
    } else if (hasMsDosProvided) {
      msDosCompatible = true;
      versionMadeBy = versionMadeBy & MAX_8_BITS;
    }
    checkIntegerOption(msdosAttributesRaw, MAX_8_BITS, ERR_INVALID_MSDOS_ATTRIBUTES);
    if (msdosAttributes && (typeof msdosAttributes !== OBJECT_TYPE || Array.isArray(msdosAttributes))) {
      throw new Error(ERR_INVALID_MSDOS_DATA);
    }
    if (versionMadeBy > MAX_16_BITS) {
      throw new Error(ERR_INVALID_VERSION);
    }
    let externalFileAttributes = getOptionValue2(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES);
    const externalFileAttributesProvided = externalFileAttributes !== UNDEFINED_VALUE;
    if (!externalFileAttributesProvided) {
      externalFileAttributes = 0;
    }
    if (!options[PROPERTY_NAME_DIRECTORY] && name.endsWith(DIRECTORY_SIGNATURE)) {
      options[PROPERTY_NAME_DIRECTORY] = true;
    }
    const directory = getOptionValue2(zipWriter, options, PROPERTY_NAME_DIRECTORY);
    if (directory) {
      if (!name.endsWith(DIRECTORY_SIGNATURE)) {
        name += DIRECTORY_SIGNATURE;
      }
      if (!externalFileAttributesProvided) {
        externalFileAttributes = FILE_ATTR_MSDOS_DIR_MASK;
        if (!msDosCompatible) {
          externalFileAttributes |= (FILE_ATTR_UNIX_TYPE_DIR | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
        }
      }
    } else if (!msDosCompatible && !externalFileAttributesProvided) {
      if (executable) {
        externalFileAttributes = (FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
      } else {
        externalFileAttributes = FILE_ATTR_UNIX_DEFAULT_MASK << 16;
      }
    }
    if (!msDosCompatible) {
      const unixModeProvided = unixMode !== UNDEFINED_VALUE || Boolean(setuid || setgid || sticky);
      const defaultUnixMode = externalFileAttributes >> 16 & MAX_16_BITS;
      unixMode = unixMode === UNDEFINED_VALUE ? defaultUnixMode : unixMode & MAX_16_BITS;
      if (setuid) {
        unixMode |= FILE_ATTR_UNIX_SETUID_MASK;
      } else {
        setuid = Boolean(unixMode & FILE_ATTR_UNIX_SETUID_MASK);
      }
      if (setgid) {
        unixMode |= FILE_ATTR_UNIX_SETGID_MASK;
      } else {
        setgid = Boolean(unixMode & FILE_ATTR_UNIX_SETGID_MASK);
      }
      if (sticky) {
        unixMode |= FILE_ATTR_UNIX_STICKY_MASK;
      } else {
        sticky = Boolean(unixMode & FILE_ATTR_UNIX_STICKY_MASK);
      }
      if (!externalFileAttributesProvided || unixModeProvided) {
        if (directory) {
          unixMode = unixMode & ~FILE_ATTR_UNIX_TYPE_MASK | FILE_ATTR_UNIX_TYPE_DIR;
        } else if (!(unixMode & FILE_ATTR_UNIX_TYPE_MASK)) {
          unixMode |= FILE_ATTR_UNIX_TYPE_FILE;
        }
        externalFileAttributes = (unixMode & MAX_16_BITS) << 16 | externalFileAttributes & MAX_16_BITS;
      }
    }
    ({ msdosAttributesRaw, msdosAttributes } = normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes));
    if (hasMsDosProvided) {
      externalFileAttributes = externalFileAttributes & MAX_32_BITS | msdosAttributesRaw & MAX_8_BITS;
    }
    const unixExternalUpper = externalFileAttributes >> 16 & MAX_16_BITS;
    const symlink = unixMode !== UNDEFINED_VALUE && (unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_SYMLINK;
    return {
      name,
      resolvedOptions: {
        versionMadeBy,
        msDosCompatible: Boolean(msDosCompatible),
        externalFileAttributes,
        unixExternalUpper,
        uid,
        gid,
        unixMode,
        unixExtraFieldType,
        symlink,
        setuid,
        setgid,
        sticky,
        msdosAttributesRaw,
        msdosAttributes
      }
    };
  }
  function resolveMetadata(zipWriter, name, options) {
    const encode = getFunctionOptionValue2(zipWriter, options, OPTION_ENCODE_TEXT) || encodeText;
    let rawFilename = encode(name, TEXT_TYPE_FILENAME);
    if (rawFilename === UNDEFINED_VALUE) {
      rawFilename = encodeText(name);
    }
    if (getLength(rawFilename) > MAX_16_BITS) {
      throw new Error(ERR_INVALID_ENTRY_NAME);
    }
    const comment = options[PROPERTY_NAME_COMMENT] || "";
    if (typeof comment != STRING_TYPE) {
      throw new Error(ERR_INVALID_ENTRY_COMMENT_TYPE);
    }
    let rawComment = encode(comment, TEXT_TYPE_COMMENT);
    if (rawComment === UNDEFINED_VALUE) {
      rawComment = encodeText(comment);
    }
    if (getLength(rawComment) > MAX_16_BITS) {
      throw new Error(ERR_INVALID_ENTRY_COMMENT);
    }
    const version = getOptionValue2(zipWriter, options, PROPERTY_NAME_VERSION);
    if (version !== UNDEFINED_VALUE && version > MAX_16_BITS) {
      throw new Error(ERR_INVALID_VERSION);
    }
    const lastModDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, /* @__PURE__ */ new Date());
    const rawLastModDate = getOptionValue2(zipWriter, options, PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
    const lastAccessDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
    const creationDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
    const internalFileAttributes = getOptionValue2(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
    const passThrough = checkPassThroughOption(getOptionValue2(zipWriter, options, OPTION_PASS_THROUGH));
    const passThroughCompression = Boolean(passThrough);
    const passThroughEncryption = passThrough === true;
    let password = getOptionValue2(zipWriter, options, OPTION_PASSWORD);
    let rawPassword = getOptionValue2(zipWriter, options, OPTION_RAW_PASSWORD);
    checkPasswordOption(password, rawPassword);
    password = password && password.length ? password : UNDEFINED_VALUE;
    rawPassword = rawPassword && rawPassword.length ? rawPassword : UNDEFINED_VALUE;
    const encryptionStrength = getNumberOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
    const zipCrypto = getOptionValue2(zipWriter, options, PROPERTY_NAME_ZIPCRYPTO);
    const extendedTimestamp = getOptionValue2(zipWriter, options, OPTION_EXTENDED_TIMESTAMP, true);
    const ntfsTimestamp = getOptionValue2(zipWriter, options, OPTION_NTFS_TIMESTAMP);
    const keepOrder = getOptionValue2(zipWriter, options, OPTION_KEEP_ORDER, true);
    const useWebWorkers = getOptionValue2(zipWriter, options, OPTION_USE_WEB_WORKERS);
    const transferStreams = getOptionValue2(zipWriter, options, OPTION_TRANSFER_STREAMS);
    const bufferedWrite = getOptionValue2(zipWriter, options, OPTION_BUFFERED_WRITE);
    const createTempStream = getFunctionOptionValue2(zipWriter, options, OPTION_CREATE_TEMP_STREAM);
    const dataDescriptorSignature = getOptionValue2(zipWriter, options, OPTION_DATA_DESCRIPTOR_SIGNATURE, true);
    const signal = checkSignalOption(getOptionValue2(zipWriter, options, OPTION_SIGNAL));
    throwIfAborted(signal);
    const useUnicodeFileNames = getOptionValue2(
      zipWriter,
      options,
      OPTION_USE_UNICODE_FILE_NAMES,
      !isPrintableASCIIText(rawFilename) || !isPrintableASCIIText(rawComment)
    );
    const compressionMethod = getOptionValue2(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
    const registeredCodec = passThroughCompression || compressionMethod === UNDEFINED_VALUE ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
    if (!passThroughCompression && compressionMethod !== UNDEFINED_VALUE && compressionMethod !== COMPRESSION_METHOD_STORE && compressionMethod !== COMPRESSION_METHOD_DEFLATE && !registeredCodec) {
      throw new Error(ERR_UNSUPPORTED_COMPRESSION);
    }
    let level = getNumberOptionValue(zipWriter, options, OPTION_LEVEL);
    checkIntegerOption(level, MAX_LEVEL, ERR_INVALID_LEVEL);
    if (zipWriter.options[OPTION_USDZ]) {
      if (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) {
        throw new Error(ERR_UNSUPPORTED_ENCRYPTION_USDZ);
      }
      if (level === UNDEFINED_VALUE && compressionMethod === UNDEFINED_VALUE) {
        level = 0;
      }
    }
    if (passThroughCompression) {
      level = toNumber(options[OPTION_LEVEL]);
    }
    let useCompressionStream = getOptionValue2(zipWriter, options, OPTION_USE_COMPRESSION_STREAM);
    let dataDescriptor = getOptionValue2(zipWriter, options, OPTION_DATA_DESCRIPTOR);
    if (bufferedWrite && dataDescriptor === UNDEFINED_VALUE) {
      dataDescriptor = false;
    }
    if (dataDescriptor === UNDEFINED_VALUE || zipCrypto && !passThroughEncryption) {
      dataDescriptor = true;
    }
    if (level !== UNDEFINED_VALUE && level != 6) {
      useCompressionStream = false;
    }
    const zip64 = getOptionValue2(zipWriter, options, PROPERTY_NAME_ZIP64);
    if (!zipCrypto && (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) && !(Number.isInteger(encryptionStrength) && encryptionStrength >= 1 && encryptionStrength <= 3)) {
      throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
    }
    const rawExtraField = serializeExtraField(options[PROPERTY_NAME_EXTRA_FIELD]);
    const rawLocalExtraField = serializeExtraField(options[OPTION_LOCAL_EXTRA_FIELD]);
    const rawCentralExtraField = serializeExtraField(options[OPTION_CENTRAL_EXTRA_FIELD]);
    return {
      comment,
      resolvedOptions: {
        rawFilename,
        rawComment,
        version,
        lastModDate,
        rawLastModDate,
        lastAccessDate,
        creationDate,
        internalFileAttributes,
        passThroughCompression,
        passThroughEncryption,
        password,
        rawPassword,
        encryptionStrength,
        zipCrypto,
        extendedTimestamp,
        ntfsTimestamp,
        keepOrder,
        useWebWorkers,
        transferStreams,
        bufferedWrite,
        createTempStream,
        dataDescriptorSignature,
        signal,
        useUnicodeFileNames,
        compressionMethod,
        format: registeredCodec ? registeredCodec.format : UNDEFINED_VALUE,
        codecURI: registeredCodec ? registeredCodec.codecURI : UNDEFINED_VALUE,
        codecVersionNeeded: registeredCodec ? registeredCodec.versionNeeded : UNDEFINED_VALUE,
        level,
        useCompressionStream,
        dataDescriptor,
        zip64,
        rawExtraField,
        rawLocalExtraField,
        rawCentralExtraField
      }
    };
  }
  function serializeExtraField(extraField) {
    if (!extraField) {
      return EMPTY_UINT8_ARRAY;
    }
    if (!(extraField instanceof Map)) {
      throw new Error(ERR_INVALID_EXTRAFIELD);
    }
    let extraFieldSize = 0;
    let offset = 0;
    extraField.forEach((data, type) => {
      checkInteger(type, MAX_16_BITS, ERR_INVALID_EXTRAFIELD_TYPE);
      if (!(data instanceof Uint8Array)) {
        throw new Error(ERR_INVALID_EXTRAFIELD_DATA_TYPE);
      }
      if (getLength(data) > MAX_16_BITS) {
        throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
      }
      extraFieldSize += 4 + getLength(data);
    });
    const rawExtraField = new Uint8Array(extraFieldSize);
    const rawExtraFieldView = getDataView(rawExtraField);
    extraField.forEach((data, type) => {
      setUint16(rawExtraFieldView, offset, type);
      setUint16(rawExtraFieldView, offset + 2, getLength(data));
      arraySet(rawExtraField, data, offset + 4);
      offset += 4 + getLength(data);
    });
    return rawExtraField;
  }
  async function resolveSizes(zipWriter, reader, { resolvedOptions: metadata }, options) {
    if (metadata.passThroughCompression && !reader && !getOptionValue2(zipWriter, options, PROPERTY_NAME_DIRECTORY)) {
      throw new Error(ERR_UNDEFINED_READER);
    }
    let contentSize;
    if (reader) {
      reader = new GenericReader(reader);
      await initStream(reader);
      if (!reader.readable && !reader.readUint8Array) {
        throw new Error(ERR_INVALID_READER);
      }
      ({ size: contentSize } = reader);
    }
    return Object.assign({ reader }, resolveEntrySizes(zipWriter, Boolean(reader), contentSize, metadata, options));
  }
  function resolveEntrySizes(zipWriter, hasContent, contentSize, metadata, options) {
    const { passThroughCompression, passThroughEncryption, zipCrypto, password, rawPassword, encryptionStrength } = metadata;
    let { dataDescriptor, zip64, level, compressionMethod } = metadata;
    let maximumCompressedSize = 0;
    let uncompressedSize = 0;
    let unknownSize = false;
    if (passThroughCompression && hasContent) {
      uncompressedSize = options[PROPERTY_NAME_UNCOMPRESSED_SIZE];
      if (uncompressedSize === UNDEFINED_VALUE) {
        throw new Error(ERR_UNDEFINED_UNCOMPRESSED_SIZE);
      }
      if (compressionMethod === UNDEFINED_VALUE) {
        throw new Error(ERR_UNDEFINED_COMPRESSION_METHOD);
      }
    }
    const zip64Enabled = zip64 === true;
    const encrypted = getOptionValue2(zipWriter, options, PROPERTY_NAME_ENCRYPTED);
    if (hasContent && passThroughEncryption && !encrypted && getLength(password, rawPassword)) {
      throw new Error(ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH);
    }
    const encryptedEntry = hasContent && (Boolean(password && getLength(password) || rawPassword && getLength(rawPassword)) || passThroughEncryption && encrypted);
    if (!hasContent) {
      level = 0;
      compressionMethod = COMPRESSION_METHOD_STORE;
    }
    const encryptionOverhead = getEncryptionOverhead(encryptedEntry, zipCrypto, encryptionStrength);
    if (hasContent) {
      if (!passThroughCompression) {
        if (contentSize === UNDEFINED_VALUE) {
          dataDescriptor = true;
          if (zip64 || zip64 === UNDEFINED_VALUE) {
            zip64 = unknownSize = true;
            maximumCompressedSize = MAX_32_BITS + 1;
          }
        } else {
          options.uncompressedSize = uncompressedSize = contentSize;
          maximumCompressedSize = (isCompressed(compressionMethod, level) ? getMaximumCompressedSize(uncompressedSize) : uncompressedSize) + encryptionOverhead;
        }
      } else {
        options.uncompressedSize = uncompressedSize;
        maximumCompressedSize = contentSize === UNDEFINED_VALUE ? getMaximumCompressedSize(uncompressedSize) + encryptionOverhead : contentSize + (passThroughEncryption ? 0 : encryptionOverhead);
      }
    }
    const emptyEntry = !encryptedEntry && (!hasContent || contentSize === 0 && !passThroughCompression) && !isCompressed(compressionMethod, level);
    if (emptyEntry && getOptionValue2(zipWriter, options, OPTION_DATA_DESCRIPTOR) === UNDEFINED_VALUE) {
      dataDescriptor = false;
    }
    const zip64UncompressedSize = zip64Enabled || unknownSize || uncompressedSize >= MAX_32_BITS;
    const zip64CompressedSize = zip64Enabled || maximumCompressedSize >= MAX_32_BITS;
    if (zip64UncompressedSize || zip64CompressedSize) {
      if (zip64 === false) {
        throw new Error(ERR_UNSUPPORTED_FORMAT);
      } else {
        zip64 = true;
      }
    }
    zip64 = zip64 || false;
    return {
      maximumCompressedSize,
      resolvedOptions: {
        dataDescriptor,
        emptyEntry,
        zip64,
        zip64Enabled,
        unknownSize,
        zip64UncompressedSize,
        zip64CompressedSize,
        uncompressedSize,
        level,
        compressionMethod,
        encrypted: encryptedEntry
      }
    };
  }
  async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
    const {
      fileEntries,
      writer
    } = zipWriter;
    const {
      keepOrder,
      dataDescriptor,
      emptyEntry,
      signal
    } = options;
    const {
      headerInfo,
      fileEntry: pendingFileEntry,
      previousFileEntry,
      releaseLockFileEntry
    } = entryInfo;
    const usdz = zipWriter.options[OPTION_USDZ];
    let fileEntry = pendingFileEntry;
    let bufferedWrite;
    let directWrite;
    let releaseLockWriter;
    let writingBufferedEntryData;
    let writingEntryData;
    let writerSizeBeforeEntry;
    let flushedBufferedSize = 0;
    let fileWriter;
    const lockPreviousFileEntry = keepOrder && previousFileEntry ? previousFileEntry.lockFileEntry : UNDEFINED_VALUE;
    fileEntries.set(name, fileEntry);
    try {
      if (options.bufferedWrite || !keepOrder || zipWriter.writerLocked || zipWriter.bufferedWrites || zipWriter.directWrites || !dataDescriptor && !emptyEntry) {
        bufferedWrite = true;
        zipWriter.bufferedWrites++;
        if (options.createTempStream) {
          fileWriter = await options.createTempStream();
        } else {
          fileWriter = new TransformStream(UNDEFINED_VALUE, UNDEFINED_VALUE, { highWaterMark: INFINITY_VALUE });
        }
        fileWriter.size = 0;
        await initStream(writer);
      } else {
        directWrite = true;
        zipWriter.directWrites++;
        fileWriter = writer;
        await lockPreviousFileEntry;
        await requestLockWriter();
      }
      await initStream(fileWriter);
      const diskOffset = getDiskOffset2(writer);
      if (zipWriter.addSplitZipSignature && !bufferedWrite) {
        await writeSplitZipSignature(zipWriter, writer);
      }
      if (usdz && !bufferedWrite) {
        appendExtraFieldUSDZ(entryInfo, zipWriter.offset - diskOffset);
      }
      const { localHeaderArray } = headerInfo;
      if (!bufferedWrite) {
        await skipDiskIfNeeded();
      }
      const diskNumberStart = getDiskNumber(writer);
      const entryOffset = getSegmentOffset(zipWriter, writer);
      fileEntry.diskNumberStart = diskNumberStart;
      if (!bufferedWrite) {
        writingEntryData = true;
        writerSizeBeforeEntry = writer.size;
        await writeData(fileWriter, localHeaderArray);
      }
      fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, getConfiguration(), options);
      if (!bufferedWrite) {
        writingEntryData = false;
      }
      fileEntries.set(name, fileEntry);
      fileEntry.filename = name;
      if (bufferedWrite) {
        await Promise.all([fileWriter.writable.getWriter().close(), lockPreviousFileEntry]);
        await requestLockWriter();
        if (zipWriter.addSplitZipSignature) {
          await writeSplitZipSignature(zipWriter, writer);
        }
        writingBufferedEntryData = true;
        writerSizeBeforeEntry = writer.size;
        await skipDiskIfNeeded();
        fileEntry.diskNumberStart = getDiskNumber(writer);
        fileEntry.offset = getSegmentOffset(zipWriter, writer);
        if (usdz) {
          const previousMetadataSize = entryInfo.metadataSize;
          appendExtraFieldUSDZ(entryInfo, zipWriter.offset - getDiskOffset2(writer));
          fileEntry.size += entryInfo.metadataSize - previousMetadataSize;
        }
        updateLocalHeader(fileEntry, headerInfo.localHeaderView, options);
        await writeData(writer, headerInfo.localHeaderArray);
        await flushBufferedData(fileWriter.readable, writer, signal, (chunkLength) => flushedBufferedSize += chunkLength);
        writer.size += fileWriter.size;
        writingBufferedEntryData = false;
      } else {
        fileEntry.diskNumberStart = diskNumberStart;
        fileEntry.offset = entryOffset;
      }
      zipWriter.offset += fileEntry.size;
      return fileEntry;
    } catch (error) {
      if (writingBufferedEntryData || writingEntryData) {
        zipWriter.hasCorruptedEntries = true;
        if (error) {
          try {
            error.corruptedEntry = true;
          } catch {
          }
        }
        zipWriter.offset += writer.size - writerSizeBeforeEntry;
        if (bufferedWrite) {
          zipWriter.offset += flushedBufferedSize;
        }
      }
      fileEntries.delete(name);
      throw error;
    } finally {
      if (bufferedWrite) {
        zipWriter.bufferedWrites--;
      }
      if (directWrite) {
        zipWriter.directWrites--;
      }
      if (releaseLockFileEntry) {
        releaseLockFileEntry(lockPreviousFileEntry);
      }
      if (releaseLockWriter) {
        releaseLockWriter();
      }
      if (bufferedWrite && fileWriter && fileWriter.dispose) {
        try {
          await fileWriter.dispose();
        } catch {
        }
      }
    }
    async function requestLockWriter() {
      zipWriter.writerLocked = true;
      const { lockWriter } = zipWriter;
      zipWriter.lockWriter = new Promise((resolve) => releaseLockWriter = () => {
        zipWriter.writerLocked = false;
        resolve();
      });
      await lockWriter;
    }
    async function skipDiskIfNeeded() {
      if (exceedsAvailableSize(writer, getLength(headerInfo.localHeaderArray))) {
        await writer.closeDisk();
      }
    }
  }
  async function createFileEntry(reader, writer, { diskNumberStart, lockFileEntry }, entryInfo, config2, options) {
    const {
      headerInfo,
      dataDescriptorInfo,
      metadataSize
    } = entryInfo;
    const {
      headerArray,
      headerView,
      lastModDate,
      rawLastModDate,
      encrypted,
      compressed,
      version,
      compressionMethod,
      rawExtraFieldZip64,
      localExtraFieldZip64Length,
      rawExtraFieldExtendedTimestamp,
      extraFieldExtendedTimestampFlag,
      extraFieldExtendedTimestampTime,
      rawExtraFieldNTFS,
      rawExtraFieldUnix,
      rawExtraFieldAES
    } = headerInfo;
    const { dataDescriptorArray } = dataDescriptorInfo;
    const {
      rawFilename,
      lastAccessDate,
      creationDate,
      password,
      rawPassword,
      level,
      useUnicodeFileNames,
      zip64,
      zip64Enabled,
      zip64UncompressedSize,
      zip64CompressedSize,
      zipCrypto,
      dataDescriptor,
      directory,
      executable,
      versionMadeBy,
      rawComment,
      rawExtraField,
      rawCentralExtraField,
      useWebWorkers,
      transferStreams,
      onstart,
      onprogress,
      onend,
      signal,
      encryptionStrength,
      extendedTimestamp,
      msDosCompatible,
      internalFileAttributes,
      externalFileAttributes,
      uid,
      gid,
      unixMode,
      symlink,
      setuid,
      setgid,
      sticky,
      unixExternalUpper,
      msdosAttributesRaw,
      msdosAttributes,
      useCompressionStream,
      passThroughCompression,
      passThroughEncryption,
      format,
      codecURI
    } = options;
    const fileEntry = {
      lockFileEntry,
      versionMadeBy,
      zip64,
      zip64Enabled,
      directory: Boolean(directory),
      executable: Boolean(executable),
      filenameUTF8: Boolean(useUnicodeFileNames),
      rawFilename,
      commentUTF8: Boolean(useUnicodeFileNames),
      rawComment,
      rawExtraFieldZip64,
      localExtraFieldZip64Length,
      rawExtraFieldExtendedTimestamp,
      rawExtraFieldNTFS,
      rawExtraFieldUnix,
      rawExtraFieldAES,
      rawExtraField,
      rawCentralExtraField,
      extendedTimestamp,
      msDosCompatible,
      internalFileAttributes,
      externalFileAttributes,
      diskNumberStart,
      uid,
      gid,
      unixMode,
      symlink: Boolean(symlink),
      setuid,
      setgid,
      sticky,
      unixExternalUpper,
      msdosAttributesRaw,
      msdosAttributes
    };
    let {
      crc32,
      uncompressedSize
    } = options;
    let compressedSize = 0;
    if (!passThroughCompression) {
      uncompressedSize = 0;
    }
    const { writable } = writer;
    if (reader) {
      const size = reader.size;
      const readable = toCompatibleReadable(createReadable(reader, { size }));
      const workerOptions = {
        options: {
          codecType: CODEC_DEFLATE,
          inputSize: size,
          level,
          rawPassword,
          password,
          encryptionStrength,
          zipCrypto: encrypted && zipCrypto,
          passwordVerification: encrypted && zipCrypto && rawLastModDate >> 8 & MAX_8_BITS,
          computeCrc32: !passThroughCompression,
          compressed: compressed && !passThroughCompression,
          encrypted: encrypted && !passThroughEncryption,
          useWebWorkers,
          useCompressionStream,
          transferStreams,
          format,
          codecURI,
          compressionMethod
        },
        config: config2,
        streamOptions: { signal, size, onstart, onprogress, onend }
      };
      try {
        const result = await runWorker2({ readable, writable }, workerOptions);
        compressedSize = result.outputSize;
        writer.size += compressedSize;
        throwIfAborted(signal);
        if (!passThroughCompression) {
          uncompressedSize = result.inputSize;
          if (!encrypted || zipCrypto) {
            crc32 = result.crc32;
          }
        }
        if (!zip64CompressedSize && compressedSize >= MAX_32_BITS || !zip64UncompressedSize && uncompressedSize >= MAX_32_BITS) {
          throw new Error(ERR_UNSUPPORTED_FORMAT);
        }
      } catch (error) {
        const { outputSize: failedOutputSize } = workerOptions;
        if (failedOutputSize !== UNDEFINED_VALUE) {
          writer.size += failedOutputSize;
        } else if (isErrorObject(error) && error.outputSize !== UNDEFINED_VALUE) {
          writer.size += error.outputSize;
        }
        throw error;
      }
    }
    setEntryInfo({
      crc32,
      compressedSize,
      uncompressedSize,
      headerInfo,
      dataDescriptorInfo
    }, options);
    if (dataDescriptor) {
      await writeData(writer, dataDescriptorArray);
    }
    Object.assign(fileEntry, {
      uncompressedSize,
      compressedSize,
      lastModDate,
      rawLastModDate,
      creationDate,
      lastAccessDate,
      encrypted: Boolean(encrypted),
      zipCrypto: Boolean(zipCrypto),
      size: metadataSize + compressedSize,
      compressionMethod,
      version,
      headerArray,
      headerView,
      signature: crc32,
      crc32: encrypted && !zipCrypto && !passThroughCompression ? UNDEFINED_VALUE : crc32,
      extraFieldExtendedTimestampFlag,
      extraFieldExtendedTimestampTime,
      zip64UncompressedSize,
      zip64CompressedSize
    });
    return fileEntry;
  }
  function getHeaderInfo(options) {
    const {
      rawFilename,
      lastModDate,
      rawLastModDate: rawLastModDateOption,
      lastAccessDate,
      creationDate,
      level,
      zip64,
      zipCrypto,
      useUnicodeFileNames,
      dataDescriptor,
      directory,
      rawExtraField,
      rawLocalExtraField,
      encryptionStrength,
      extendedTimestamp,
      ntfsTimestamp,
      passThroughCompression,
      encrypted,
      zip64UncompressedSize,
      zip64CompressedSize,
      uncompressedSize,
      unknownSize,
      crc32
    } = options;
    let { version, compressionMethod } = options;
    const compressed = !directory && isCompressed(compressionMethod, level);
    let rawLocalExtraFieldZip64;
    const uncompressedFile = passThroughCompression || !compressed;
    const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || !dataDescriptor || (!zip64UncompressedSize && !zip64CompressedSize || uncompressedFile && !unknownSize));
    const writeLocalExtraFieldZip64 = zip64ExtraFieldComplete || zip64 && dataDescriptor && (zip64UncompressedSize || zip64CompressedSize);
    if (zip64 && (zip64UncompressedSize || zip64CompressedSize)) {
      const length = 4 + 16;
      const extraFieldZip64 = createRecordWriter(length);
      extraFieldZip64.writeUint16(EXTRAFIELD_TYPE_ZIP64);
      extraFieldZip64.writeUint16(length - 4);
      rawLocalExtraFieldZip64 = extraFieldZip64.array;
      if (zip64ExtraFieldComplete) {
        extraFieldZip64.writeUint64(uncompressedSize);
        if (uncompressedFile) {
          const encryptionOverhead = getEncryptionOverhead(encrypted, zipCrypto, encryptionStrength);
          extraFieldZip64.writeUint64(passThroughCompression ? 0 : uncompressedSize + encryptionOverhead);
        }
      }
    } else {
      rawLocalExtraFieldZip64 = EMPTY_UINT8_ARRAY;
    }
    let rawExtraFieldAES;
    if (encrypted && !zipCrypto) {
      const extraFieldAES = createRecordWriter(getLength(EXTRAFIELD_DATA_AES) + 2);
      extraFieldAES.writeUint16(EXTRAFIELD_TYPE_AES);
      extraFieldAES.writeBytes(EXTRAFIELD_DATA_AES);
      rawExtraFieldAES = extraFieldAES.array;
      rawExtraFieldAES[8] = encryptionStrength;
    } else {
      rawExtraFieldAES = EMPTY_UINT8_ARRAY;
    }
    let rawExtraFieldNTFS;
    let rawExtraFieldExtendedTimestamp;
    let extraFieldExtendedTimestampFlag;
    let extraFieldExtendedTimestampTime;
    if (extendedTimestamp) {
      const lastModTimeUnix = getTimeUnix(lastModDate);
      const lastModTimeUnixInRange = inUnixTimeRange(lastModTimeUnix);
      if (lastModTimeUnixInRange) {
        const extraFieldTimestampLength = 9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0);
        const extraFieldTimestamp = createRecordWriter(extraFieldTimestampLength);
        extraFieldExtendedTimestampFlag = 1 + (lastAccessDate ? 2 : 0) + (creationDate ? 4 : 0);
        extraFieldExtendedTimestampTime = lastModTimeUnix;
        extraFieldTimestamp.writeUint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
        extraFieldTimestamp.writeUint16(extraFieldTimestampLength - 4);
        extraFieldTimestamp.writeUint8(extraFieldExtendedTimestampFlag);
        extraFieldTimestamp.writeUint32(lastModTimeUnix);
        if (lastAccessDate) {
          extraFieldTimestamp.writeUint32(clampUnixTime(getTimeUnix(lastAccessDate)));
        }
        if (creationDate) {
          extraFieldTimestamp.writeUint32(clampUnixTime(getTimeUnix(creationDate)));
        }
        rawExtraFieldExtendedTimestamp = extraFieldTimestamp.array;
      } else {
        rawExtraFieldExtendedTimestamp = EMPTY_UINT8_ARRAY;
      }
      const writeExtraFieldNTFS = ntfsTimestamp === UNDEFINED_VALUE ? !lastModTimeUnixInRange || Boolean(lastAccessDate || creationDate) : ntfsTimestamp;
      if (writeExtraFieldNTFS) {
        try {
          const lastModTimeNTFS = getTimeNTFS(lastModDate);
          const extraFieldNTFS = createRecordWriter(36);
          extraFieldNTFS.writeUint16(EXTRAFIELD_TYPE_NTFS);
          extraFieldNTFS.writeUint16(32);
          extraFieldNTFS.skip(4);
          extraFieldNTFS.writeUint16(EXTRAFIELD_TYPE_NTFS_TAG1);
          extraFieldNTFS.writeUint16(24);
          extraFieldNTFS.writeUint64(lastModTimeNTFS);
          extraFieldNTFS.writeUint64(lastAccessDate ? getTimeNTFS(lastAccessDate) : lastModTimeNTFS);
          extraFieldNTFS.writeUint64(creationDate ? getTimeNTFS(creationDate) : lastModTimeNTFS);
          rawExtraFieldNTFS = extraFieldNTFS.array;
        } catch {
          rawExtraFieldNTFS = EMPTY_UINT8_ARRAY;
        }
      } else {
        rawExtraFieldNTFS = EMPTY_UINT8_ARRAY;
      }
    } else {
      rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = EMPTY_UINT8_ARRAY;
    }
    let rawExtraFieldUnix;
    try {
      const { uid, gid, unixExtraFieldType } = options;
      if (unixExtraFieldType == INFOZIP_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
        const uidBytes = packUnixId(uid === UNDEFINED_VALUE ? 0 : uid);
        const gidBytes = packUnixId(gid === UNDEFINED_VALUE ? 0 : gid);
        const payloadLength = 3 + uidBytes.length + gidBytes.length;
        const extraFieldUnix = createRecordWriter(4 + payloadLength);
        extraFieldUnix.writeUint16(EXTRAFIELD_TYPE_INFOZIP);
        extraFieldUnix.writeUint16(payloadLength);
        extraFieldUnix.writeUint8(1);
        extraFieldUnix.writeUint8(uidBytes.length);
        extraFieldUnix.writeBytes(uidBytes);
        extraFieldUnix.writeUint8(gidBytes.length);
        extraFieldUnix.writeBytes(gidBytes);
        rawExtraFieldUnix = extraFieldUnix.array;
      } else if (unixExtraFieldType == UNIX_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
        const extraFieldUnix = createRecordWriter(8);
        extraFieldUnix.writeUint16(EXTRAFIELD_TYPE_UNIX);
        extraFieldUnix.writeUint16(4);
        extraFieldUnix.writeUint16((uid === UNDEFINED_VALUE ? 0 : uid) & MAX_16_BITS);
        extraFieldUnix.writeUint16((gid === UNDEFINED_VALUE ? 0 : gid) & MAX_16_BITS);
        rawExtraFieldUnix = extraFieldUnix.array;
      } else {
        rawExtraFieldUnix = EMPTY_UINT8_ARRAY;
      }
    } catch {
      rawExtraFieldUnix = EMPTY_UINT8_ARRAY;
    }
    if (compressionMethod === UNDEFINED_VALUE) {
      compressionMethod = compressed ? COMPRESSION_METHOD_DEFLATE : COMPRESSION_METHOD_STORE;
    }
    if (version === UNDEFINED_VALUE) {
      version = compressionMethod == COMPRESSION_METHOD_STORE && !directory && !encrypted ? VERSION_STORE : VERSION_DEFLATE;
    }
    const { codecVersionNeeded } = options;
    if (compressed && codecVersionNeeded !== UNDEFINED_VALUE) {
      version = version > codecVersionNeeded ? version : codecVersionNeeded;
    }
    if (zip64) {
      version = version > VERSION_ZIP64 ? version : VERSION_ZIP64;
    }
    if (encrypted && !zipCrypto) {
      version = version > VERSION_AES ? version : VERSION_AES;
      if (passThroughCompression && crc32 !== UNDEFINED_VALUE) {
        rawExtraFieldAES[EXTRAFIELD_OFFSET_AES_VENDOR_VERSION] = VENDOR_VERSION_AE_12;
      }
      setUint16(getDataView(rawExtraFieldAES), EXTRAFIELD_OFFSET_AES_COMPRESSION_METHOD, compressionMethod);
      compressionMethod = COMPRESSION_METHOD_AES;
    }
    const localExtraFieldZip64Length = writeLocalExtraFieldZip64 ? getLength(rawLocalExtraFieldZip64) : 0;
    const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, rawLocalExtraField);
    const maximumUsdzExtraFieldLength = options[OPTION_USDZ] ? EXTRAFIELD_USDZ_MAX_LENGTH : 0;
    if (extraFieldLength + maximumUsdzExtraFieldLength > MAX_16_BITS) {
      throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
    }
    const dosLastModDate = new Date(Math.ceil(Math.floor(lastModDate.getTime() / 1e3) / 2) * 2e3);
    const clampedLastModDate = dosLastModDate < MIN_DATE ? MIN_DATE : dosLastModDate > MAX_DATE ? MAX_DATE : dosLastModDate;
    const storedLastModDate = getLength(rawExtraFieldExtendedTimestamp) ? new Date(getTimeUnix(lastModDate) * 1e3) : getLength(rawExtraFieldNTFS) ? lastModDate : clampedLastModDate;
    const {
      headerArray,
      headerView,
      rawLastModDate
    } = getHeaderArrayData({
      version,
      bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
      compressionMethod,
      uncompressedSize,
      lastModDate: clampedLastModDate,
      rawLastModDate: rawLastModDateOption,
      rawFilename,
      zip64CompressedSize,
      zip64UncompressedSize,
      extraFieldLength
    });
    const localHeader = createRecordWriter(HEADER_SIZE + getLength(rawFilename) + extraFieldLength);
    const localHeaderArray = localHeader.array;
    const localHeaderView = getDataView(localHeaderArray);
    localHeader.writeUint32(LOCAL_FILE_HEADER_SIGNATURE);
    localHeader.writeBytes(headerArray);
    localHeader.writeBytes(rawFilename);
    if (writeLocalExtraFieldZip64) {
      localHeader.writeBytes(rawLocalExtraFieldZip64);
    }
    localHeader.writeBytes(rawExtraFieldAES);
    localHeader.writeBytes(rawExtraFieldExtendedTimestamp);
    localHeader.writeBytes(rawExtraFieldNTFS);
    localHeader.writeBytes(rawExtraFieldUnix);
    localHeader.writeBytes(rawExtraField);
    localHeader.writeBytes(rawLocalExtraField);
    if (dataDescriptor) {
      if (!zip64CompressedSize) {
        setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, 0);
      }
      if (!zip64UncompressedSize) {
        setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, 0);
      }
    }
    return {
      localHeaderArray,
      localHeaderView,
      headerArray,
      headerView,
      lastModDate: storedLastModDate,
      lastModDateClamped: storedLastModDate === clampedLastModDate && dosLastModDate.getTime() != clampedLastModDate.getTime(),
      rawLastModDate,
      encrypted,
      compressed,
      version,
      compressionMethod,
      extraFieldExtendedTimestampFlag,
      extraFieldExtendedTimestampTime,
      rawExtraFieldZip64: EMPTY_UINT8_ARRAY,
      localExtraFieldZip64Length,
      rawExtraFieldExtendedTimestamp,
      rawExtraFieldNTFS,
      rawExtraFieldUnix,
      rawExtraFieldAES,
      extraFieldLength
    };
  }
  function appendExtraFieldUSDZ(entryInfo, zipWriterOffset) {
    const { headerInfo } = entryInfo;
    let { localHeaderArray, extraFieldLength } = headerInfo;
    let extraBytesLength = 64 - (zipWriterOffset + getLength(localHeaderArray)) % 64;
    if (extraBytesLength < 4) {
      extraBytesLength += 64;
    }
    const rawExtraFieldUSDZ = new Uint8Array(extraBytesLength);
    const extraFieldUSDZView = getDataView(rawExtraFieldUSDZ);
    setUint16(extraFieldUSDZView, 0, EXTRAFIELD_TYPE_USDZ);
    setUint16(extraFieldUSDZView, 2, extraBytesLength - 4);
    const previousLocalHeaderArray = localHeaderArray;
    headerInfo.localHeaderArray = localHeaderArray = new Uint8Array(getLength(previousLocalHeaderArray) + extraBytesLength);
    arraySet(localHeaderArray, previousLocalHeaderArray);
    arraySet(localHeaderArray, rawExtraFieldUSDZ, getLength(previousLocalHeaderArray));
    const localHeaderArrayView = getDataView(localHeaderArray);
    setUint16(localHeaderArrayView, 28, extraFieldLength + extraBytesLength);
    headerInfo.localHeaderView = localHeaderArrayView;
    entryInfo.metadataSize += extraBytesLength;
  }
  function packUnixId(id) {
    const dataArray = new Uint8Array(4);
    const dataView = getDataView(dataArray);
    dataView.setUint32(0, id, true);
    let length = 4;
    while (length > 1 && dataArray[length - 1] === 0) {
      length--;
    }
    return dataArray.subarray(0, length);
  }
  function normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes) {
    if (msdosAttributesRaw !== UNDEFINED_VALUE) {
      msdosAttributesRaw = msdosAttributesRaw & MAX_8_BITS;
    } else if (msdosAttributes !== UNDEFINED_VALUE) {
      const { readOnly, hidden, system, directory: msdDir, archive } = msdosAttributes;
      let raw = 0;
      if (readOnly) raw |= FILE_ATTR_MSDOS_READONLY_MASK;
      if (hidden) raw |= FILE_ATTR_MSDOS_HIDDEN_MASK;
      if (system) raw |= FILE_ATTR_MSDOS_SYSTEM_MASK;
      if (msdDir) raw |= FILE_ATTR_MSDOS_DIR_MASK;
      if (archive) raw |= FILE_ATTR_MSDOS_ARCHIVE_MASK;
      msdosAttributesRaw = raw & MAX_8_BITS;
    }
    if (msdosAttributes === UNDEFINED_VALUE) {
      msdosAttributes = {
        readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
        hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
        system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
        directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
        archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
      };
    }
    return { msdosAttributesRaw, msdosAttributes };
  }
  function getDataDescriptorInfo({
    zip64,
    dataDescriptor,
    dataDescriptorSignature
  }) {
    let dataDescriptorArray = EMPTY_UINT8_ARRAY;
    let dataDescriptorView, dataDescriptorOffset = 0;
    let dataDescriptorLength = zip64 ? DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH : DATA_DESCRIPTOR_RECORD_LENGTH;
    if (dataDescriptorSignature) {
      dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
    }
    if (dataDescriptor) {
      dataDescriptorArray = new Uint8Array(dataDescriptorLength);
      dataDescriptorView = getDataView(dataDescriptorArray);
      if (dataDescriptorSignature) {
        dataDescriptorOffset = DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
        setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
      }
    }
    return {
      dataDescriptorArray,
      dataDescriptorView,
      dataDescriptorOffset
    };
  }
  function setEntryInfo({
    crc32,
    compressedSize,
    uncompressedSize,
    headerInfo,
    dataDescriptorInfo
  }, {
    zip64,
    zipCrypto,
    passThroughCompression,
    dataDescriptor
  }) {
    const {
      headerView,
      encrypted
    } = headerInfo;
    const {
      dataDescriptorView,
      dataDescriptorOffset
    } = dataDescriptorInfo;
    if ((!encrypted || zipCrypto || passThroughCompression) && crc32 !== UNDEFINED_VALUE) {
      setUint32(headerView, HEADER_OFFSET_SIGNATURE, crc32);
      if (dataDescriptor) {
        setUint32(dataDescriptorView, dataDescriptorOffset, crc32);
      }
    }
    if (zip64) {
      if (dataDescriptor) {
        setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
        setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
      }
    } else {
      setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
      setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
      if (dataDescriptor) {
        setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
        setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
      }
    }
  }
  function updateLocalHeader({
    rawFilename,
    encrypted,
    zip64,
    localExtraFieldZip64Length,
    crc32,
    compressedSize,
    uncompressedSize,
    zip64UncompressedSize,
    zip64CompressedSize
  }, localHeaderView, { dataDescriptor, passThroughCompression }) {
    if (!dataDescriptor) {
      if (!encrypted || passThroughCompression && crc32 !== UNDEFINED_VALUE) {
        setUint32(localHeaderView, HEADER_OFFSET_SIGNATURE + LOCAL_HEADER_COMMON_OFFSET, crc32);
      }
      if (!zip64CompressedSize) {
        setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, compressedSize);
      }
      if (!zip64UncompressedSize) {
        setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, uncompressedSize);
      }
    }
    if (zip64 && localExtraFieldZip64Length) {
      const localHeaderOffset = HEADER_SIZE + getLength(rawFilename) + 4;
      setBigUint64(localHeaderView, localHeaderOffset, BigInt(uncompressedSize));
      setBigUint64(localHeaderView, localHeaderOffset + 8, BigInt(compressedSize));
    }
  }
  async function closeFile(zipWriter, comment, options) {
    const { directoryDataLength, zip64Entries } = createDirectoryRecords(zipWriter.fileEntries);
    const { directoryStart, directoryEnd, directoryArray } = await writeDirectoryRecords(zipWriter, directoryDataLength, options);
    const signatureLength = await writeDigitalSignatureRecord(zipWriter, directoryArray, options);
    await writeEndOfDirectoryRecord(zipWriter, comment, options, { directoryStart, directoryEnd, directoryDataLength, signatureLength, zip64Entries });
  }
  function createDirectoryRecords(files) {
    let directoryDataLength = 0;
    let zip64Entries = false;
    for (const [, fileEntry] of files) {
      const {
        rawFilename,
        rawExtraFieldAES,
        rawComment,
        rawExtraFieldNTFS,
        rawExtraFieldUnix,
        rawExtraField,
        rawCentralExtraField,
        extraFieldExtendedTimestampFlag,
        extraFieldExtendedTimestampTime,
        zip64Enabled,
        uncompressedSize,
        compressedSize
      } = fileEntry;
      let { zip64UncompressedSize, zip64CompressedSize } = fileEntry;
      if (!zip64Enabled) {
        if (zip64UncompressedSize && uncompressedSize < MAX_32_BITS) {
          zip64UncompressedSize = fileEntry.zip64UncompressedSize = false;
        }
        if (zip64CompressedSize && compressedSize < MAX_32_BITS) {
          zip64CompressedSize = fileEntry.zip64CompressedSize = false;
        }
      }
      zip64Entries = zip64Entries || zip64UncompressedSize || zip64CompressedSize;
      const zip64Offset = fileEntry.offset >= MAX_32_BITS;
      const zip64DiskNumberStart = fileEntry.diskNumberStart >= MAX_16_BITS;
      let rawExtraFieldZip64;
      if (zip64Offset || zip64DiskNumberStart || zip64UncompressedSize || zip64CompressedSize) {
        const length = 4 + (zip64UncompressedSize ? 8 : 0) + (zip64CompressedSize ? 8 : 0) + (zip64Offset ? 8 : 0) + (zip64DiskNumberStart ? 4 : 0);
        const extraFieldZip64 = createRecordWriter(length);
        extraFieldZip64.writeUint16(EXTRAFIELD_TYPE_ZIP64);
        extraFieldZip64.writeUint16(length - 4);
        if (zip64UncompressedSize) {
          extraFieldZip64.writeUint64(uncompressedSize);
        }
        if (zip64CompressedSize) {
          extraFieldZip64.writeUint64(compressedSize);
        }
        if (zip64Offset) {
          extraFieldZip64.writeUint64(fileEntry.offset);
        }
        if (zip64DiskNumberStart) {
          extraFieldZip64.writeUint32(fileEntry.diskNumberStart);
        }
        rawExtraFieldZip64 = extraFieldZip64.array;
      } else {
        rawExtraFieldZip64 = EMPTY_UINT8_ARRAY;
      }
      fileEntry.rawExtraFieldZip64 = rawExtraFieldZip64;
      fileEntry.zip64Offset = zip64Offset;
      fileEntry.zip64DiskNumberStart = zip64DiskNumberStart;
      let rawExtraFieldTimestamp;
      if (extraFieldExtendedTimestampTime === UNDEFINED_VALUE) {
        rawExtraFieldTimestamp = EMPTY_UINT8_ARRAY;
      } else {
        const extraFieldTimestamp = createRecordWriter(9);
        extraFieldTimestamp.writeUint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
        extraFieldTimestamp.writeUint16(5);
        extraFieldTimestamp.writeUint8(extraFieldExtendedTimestampFlag);
        extraFieldTimestamp.writeUint32(extraFieldExtendedTimestampTime);
        rawExtraFieldTimestamp = extraFieldTimestamp.array;
      }
      fileEntry.rawExtraFieldExtendedTimestamp = rawExtraFieldTimestamp;
      const extraFieldLength = getLength(
        rawExtraFieldZip64,
        rawExtraFieldAES,
        rawExtraFieldNTFS,
        rawExtraFieldUnix,
        rawExtraFieldTimestamp,
        rawExtraField,
        rawCentralExtraField
      );
      if (extraFieldLength > MAX_16_BITS) {
        throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
      }
      directoryDataLength += CENTRAL_FILE_HEADER_LENGTH + getLength(rawFilename, rawComment) + extraFieldLength;
    }
    return { directoryDataLength, zip64Entries };
  }
  async function writeDirectoryRecords(zipWriter, directoryDataLength, options) {
    const { fileEntries, writer } = zipWriter;
    const directoryArray = new Uint8Array(directoryDataLength);
    await initStream(writer);
    let offset = 0;
    let directoryDiskOffset = 0;
    let directoryStartDiskNumber = getDiskNumber(writer);
    let directoryStartDiskOffset = getDiskOffset2(writer);
    let directoryEndDiskEntriesLength = 0;
    for (const [indexFileEntry, fileEntry] of Array.from(fileEntries.values()).entries()) {
      const {
        offset: fileEntryOffset,
        rawFilename,
        rawExtraFieldZip64,
        rawExtraFieldAES,
        rawExtraFieldExtendedTimestamp,
        rawExtraFieldNTFS,
        rawExtraFieldUnix,
        rawExtraField,
        rawCentralExtraField,
        rawComment,
        versionMadeBy,
        headerArray,
        headerView,
        zip64UncompressedSize,
        zip64CompressedSize,
        zip64DiskNumberStart,
        zip64Offset,
        internalFileAttributes,
        externalFileAttributes,
        diskNumberStart,
        uncompressedSize,
        compressedSize
      } = fileEntry;
      const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, rawCentralExtraField);
      const directoryRecordLength = CENTRAL_FILE_HEADER_LENGTH + getLength(rawFilename, rawComment) + extraFieldLength;
      if (exceedsAvailableSize(writer, offset + directoryRecordLength - directoryDiskOffset)) {
        await writeData(writer, directoryArray.slice(directoryDiskOffset, offset));
        directoryDiskOffset = offset;
        directoryEndDiskEntriesLength = 0;
        await writer.closeDisk();
      }
      if (indexFileEntry == 0) {
        directoryStartDiskNumber = getDiskNumber(writer);
        directoryStartDiskOffset = getDiskOffset2(writer);
      }
      if (!zip64UncompressedSize) {
        setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
      }
      if (!zip64CompressedSize) {
        setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
      }
      if ((zip64Offset || zip64DiskNumberStart) && fileEntry.version < VERSION_ZIP64) {
        setUint16(headerView, HEADER_OFFSET_VERSION, VERSION_ZIP64);
      }
      const directoryRecord = createRecordWriter(directoryRecordLength);
      directoryRecord.writeUint32(CENTRAL_FILE_HEADER_SIGNATURE);
      directoryRecord.writeUint16(versionMadeBy);
      directoryRecord.writeBytes(headerArray.subarray(0, HEADER_SIZE - 4 - 2));
      directoryRecord.writeUint16(extraFieldLength);
      directoryRecord.writeUint16(getLength(rawComment));
      directoryRecord.writeUint16(zip64DiskNumberStart ? MAX_16_BITS : diskNumberStart);
      directoryRecord.writeUint16(internalFileAttributes);
      directoryRecord.writeUint32(externalFileAttributes);
      directoryRecord.writeUint32(zip64Offset ? MAX_32_BITS : fileEntryOffset);
      directoryRecord.writeBytes(rawFilename);
      directoryRecord.writeBytes(rawExtraFieldZip64);
      directoryRecord.writeBytes(rawExtraFieldAES);
      directoryRecord.writeBytes(rawExtraFieldExtendedTimestamp);
      directoryRecord.writeBytes(rawExtraFieldNTFS);
      directoryRecord.writeBytes(rawExtraFieldUnix);
      directoryRecord.writeBytes(rawExtraField);
      directoryRecord.writeBytes(rawCentralExtraField);
      directoryRecord.writeBytes(rawComment);
      arraySet(directoryArray, directoryRecord.array, offset);
      offset += directoryRecordLength;
      directoryEndDiskEntriesLength++;
      if (options.onprogress) {
        try {
          await options.onprogress(indexFileEntry + 1, fileEntries.size, new Entry(fileEntry));
        } catch {
        }
      }
    }
    await writeData(writer, directoryDiskOffset ? directoryArray.slice(directoryDiskOffset) : directoryArray);
    return {
      directoryStart: { diskNumber: directoryStartDiskNumber, diskOffset: directoryStartDiskOffset },
      directoryEnd: { diskNumber: getDiskNumber(writer), entriesLength: directoryEndDiskEntriesLength },
      directoryArray
    };
  }
  async function writeDigitalSignatureRecord(zipWriter, directoryArray, options) {
    const signCentralDirectory = getFunctionOptionValue2(zipWriter, options, OPTION_SIGN_CENTRAL_DIRECTORY);
    if (signCentralDirectory) {
      const signatureData = await signCentralDirectory(directoryArray);
      const signatureDataLength = getLength(signatureData);
      if (signatureDataLength > MAX_16_BITS) {
        throw new Error(ERR_INVALID_SIGNATURE_DATA);
      }
      const signatureRecord = createRecordWriter(6 + signatureDataLength);
      signatureRecord.writeUint32(DIGITAL_SIGNATURE_RECORD_SIGNATURE);
      signatureRecord.writeUint16(signatureDataLength);
      signatureRecord.writeBytes(signatureData);
      const { writer } = zipWriter;
      if (exceedsAvailableSize(writer, getLength(signatureRecord.array))) {
        await writer.closeDisk();
      }
      await writeData(writer, signatureRecord.array);
      return 6 + signatureDataLength;
    }
    return 0;
  }
  async function writeEndOfDirectoryRecord(zipWriter, comment, options, cdInfo) {
    const { writer } = zipWriter;
    const { directoryStart, directoryEnd, signatureLength, zip64Entries } = cdInfo;
    let { directoryDataLength } = cdInfo;
    let fileEntriesLength = zipWriter.fileEntries.size;
    let diskNumber = directoryStart.diskNumber;
    let directoryOffset = getSegmentOffset(zipWriter, directoryStart);
    const commentLength = getLength(comment);
    if (commentLength > MAX_16_BITS) {
      throw new Error(ERR_INVALID_COMMENT);
    }
    let zip64 = getOptionValue2(zipWriter, options, PROPERTY_NAME_ZIP64);
    let lastDiskNumber = getDiskNumber(writer);
    if (exceedsAvailableSize(writer, (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH) + commentLength)) {
      lastDiskNumber++;
    }
    if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || fileEntriesLength >= MAX_16_BITS || lastDiskNumber >= MAX_16_BITS) {
      if (zip64 === false) {
        throw new Error(ERR_UNSUPPORTED_FORMAT);
      } else {
        zip64 = true;
      }
    } else if (zip64 === UNDEFINED_VALUE && zip64Entries) {
      zip64 = true;
    }
    const endOfdirectoryRecord = createRecordWriter(zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
    if (exceedsAvailableSize(writer, getLength(endOfdirectoryRecord.array) + commentLength)) {
      await writer.closeDisk();
    }
    lastDiskNumber = getDiskNumber(writer);
    let diskFileEntriesLength = lastDiskNumber == directoryEnd.diskNumber ? directoryEnd.entriesLength : 0;
    if (zip64) {
      endOfdirectoryRecord.writeUint32(ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
      endOfdirectoryRecord.writeUint64(44);
      endOfdirectoryRecord.writeUint16(45);
      endOfdirectoryRecord.writeUint16(45);
      endOfdirectoryRecord.writeUint32(lastDiskNumber);
      endOfdirectoryRecord.writeUint32(diskNumber);
      endOfdirectoryRecord.writeUint64(diskFileEntriesLength);
      endOfdirectoryRecord.writeUint64(fileEntriesLength);
      endOfdirectoryRecord.writeUint64(directoryDataLength);
      endOfdirectoryRecord.writeUint64(directoryOffset);
      endOfdirectoryRecord.writeUint32(ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
      endOfdirectoryRecord.writeUint32(lastDiskNumber);
      endOfdirectoryRecord.writeUint64(BigInt(getSegmentOffset(zipWriter, writer)) + BigInt(directoryDataLength) + BigInt(signatureLength));
      endOfdirectoryRecord.writeUint32(lastDiskNumber + 1);
      const supportZip64SplitFile = getOptionValue2(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true);
      if (supportZip64SplitFile) {
        lastDiskNumber = MAX_16_BITS;
        diskNumber = MAX_16_BITS;
      }
      diskFileEntriesLength = MAX_16_BITS;
      fileEntriesLength = MAX_16_BITS;
      directoryOffset = MAX_32_BITS;
      directoryDataLength = MAX_32_BITS;
    }
    endOfdirectoryRecord.writeUint32(END_OF_CENTRAL_DIR_SIGNATURE);
    endOfdirectoryRecord.writeUint16(lastDiskNumber);
    endOfdirectoryRecord.writeUint16(diskNumber);
    endOfdirectoryRecord.writeUint16(diskFileEntriesLength);
    endOfdirectoryRecord.writeUint16(fileEntriesLength);
    endOfdirectoryRecord.writeUint32(directoryDataLength);
    endOfdirectoryRecord.writeUint32(directoryOffset);
    endOfdirectoryRecord.writeUint16(commentLength);
    await writeData(writer, endOfdirectoryRecord.array);
    if (commentLength) {
      await writeData(writer, comment);
    }
  }
  function createRecordWriter(length) {
    const array = new Uint8Array(length);
    const view = getDataView(array);
    let offset = 0;
    return {
      array,
      writeUint8: (value) => {
        setUint8(view, offset, value);
        offset += 1;
      },
      writeUint16: (value) => {
        setUint16(view, offset, value);
        offset += 2;
      },
      writeUint32: (value) => {
        setUint32(view, offset, value);
        offset += 4;
      },
      writeUint64: (value) => {
        setBigUint64(view, offset, BigInt(value));
        offset += 8;
      },
      writeBytes: (value) => {
        arraySet(array, value, offset);
        offset += getLength(value);
      },
      skip: (count) => offset += count
    };
  }
  function getDiskNumber(writer) {
    const { diskNumber = 0 } = writer;
    return diskNumber;
  }
  function getDiskOffset2(writer) {
    const { diskOffset = 0 } = writer;
    return diskOffset;
  }
  function exceedsAvailableSize(writer, length) {
    const { availableSize = INFINITY_VALUE } = writer;
    return length > availableSize;
  }
  function getSegmentOffset(zipWriter, { diskNumber = 0, diskOffset = 0 }) {
    return zipWriter.offset - diskOffset - (diskNumber ? zipWriter.initialOffset : 0);
  }
  async function startsWithSplitZipSignature2(reader) {
    const signatureArray = await readUint8Array(reader, 0, SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
    return getUint322(getDataView(signatureArray), 0) == SPLIT_ZIP_FILE_SIGNATURE;
  }
  function removeExtraFieldZip64(rawExtraField) {
    const rawExtraFieldView = getDataView(rawExtraField);
    let offsetExtraField = 0;
    while (offsetExtraField + 4 <= getLength(rawExtraField)) {
      const size = 4 + getUint162(rawExtraFieldView, offsetExtraField + 2);
      if (getUint162(rawExtraFieldView, offsetExtraField) == EXTRAFIELD_TYPE_ZIP64) {
        return removeExtraFieldZip64(concat(
          rawExtraField.subarray(0, offsetExtraField),
          rawExtraField.subarray(Math.min(offsetExtraField + size, getLength(rawExtraField)))
        ));
      }
      offsetExtraField += size;
    }
    return rawExtraField;
  }
  async function copyZipData(zipWriter, reader, entries, directoryOffset) {
    const { writer } = zipWriter;
    const entryPositions = /* @__PURE__ */ new Map();
    if (writer.closeDisk) {
      const sortedEntries = Array.from(entries).sort((firstEntry, secondEntry) => getSourceOffset(reader, firstEntry) - getSourceOffset(reader, secondEntry));
      let copiedLength = 0;
      for (const entry of sortedEntries) {
        const sourceOffset = getSourceOffset(reader, entry);
        await copyData(zipWriter, reader, copiedLength, sourceOffset - copiedLength);
        if (exceedsAvailableSize(writer, await getLocalHeaderLength(reader, sourceOffset))) {
          await writer.closeDisk();
        }
        entryPositions.set(entry, {
          offset: getSegmentOffset(zipWriter, writer),
          diskNumberStart: getDiskNumber(writer)
        });
        copiedLength = sourceOffset;
      }
      await copyData(zipWriter, reader, copiedLength, directoryOffset - copiedLength);
    } else {
      const baseOffset = zipWriter.offset;
      await copyData(zipWriter, reader, 0, directoryOffset);
      entries.forEach((entry) => entryPositions.set(entry, {
        offset: baseOffset + getSourceOffset(reader, entry),
        diskNumberStart: 0
      }));
    }
    return entryPositions;
  }
  async function copyData(zipWriter, reader, offset, size) {
    if (size > 0) {
      const { writer } = zipWriter;
      let copiedLength = 0;
      try {
        await flushBufferedData(createReadable(reader, { offset, size }), writer, UNDEFINED_VALUE, (chunkLength) => copiedLength += chunkLength);
      } catch (error) {
        zipWriter.hasCorruptedEntries = true;
        try {
          error.corruptedEntry = true;
        } catch {
        }
        throw error;
      } finally {
        writer.size += copiedLength;
        zipWriter.offset += copiedLength;
      }
    }
  }
  async function getLocalHeaderLength(reader, offset) {
    const headerArray = await readUint8Array(reader, offset, HEADER_SIZE);
    if (getLength(headerArray) < HEADER_SIZE) {
      return HEADER_SIZE;
    }
    const headerView = getDataView(headerArray);
    return HEADER_SIZE + getUint162(headerView, HEADER_OFFSET_FILENAME_LENGTH + LOCAL_HEADER_COMMON_OFFSET) + getUint162(headerView, HEADER_OFFSET_EXTRAFIELD_LENGTH + LOCAL_HEADER_COMMON_OFFSET);
  }
  function getSourceOffset(reader, { offset, diskNumberStart }) {
    return offset + (reader.getDiskOffset ? reader.getDiskOffset(diskNumberStart) : 0);
  }
  function getSplitZipSignatureArray() {
    const signatureArray = new Uint8Array(SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
    setUint32(getDataView(signatureArray), 0, SPLIT_ZIP_FILE_SIGNATURE);
    return signatureArray;
  }
  async function writeSplitZipSignature(zipWriter, writer) {
    delete zipWriter.addSplitZipSignature;
    await writeData(writer, getSplitZipSignatureArray());
    zipWriter.offset += SPLIT_ZIP_FILE_SIGNATURE_LENGTH;
  }
  async function writeData(writer, array) {
    const { writable } = writer;
    const streamWriter = writable.getWriter();
    try {
      await streamWriter.ready;
      writer.size += getLength(array);
      await streamWriter.write(array);
    } finally {
      streamWriter.releaseLock();
    }
  }
  async function flushBufferedData(readable, writer, signal, onChunkWritten) {
    const streamWriter = writer.writable.getWriter();
    try {
      await readable.pipeTo(new WritableStream({
        async write(chunk) {
          await streamWriter.ready;
          await streamWriter.write(chunk);
          onChunkWritten(getLength(chunk));
        }
      }), { preventClose: true, preventAbort: true, signal });
    } finally {
      streamWriter.releaseLock();
    }
  }
  function getTimeNTFS(date) {
    if (date) {
      const timeNTFS = (BigInt(date.getTime()) + BigInt(116444736e5)) * BigInt(1e4);
      return timeNTFS < MIN_NTFS_TIME ? MIN_NTFS_TIME : timeNTFS > MAX_NTFS_TIME ? MAX_NTFS_TIME : timeNTFS;
    }
  }
  function getTimeUnix(date) {
    return Math.floor(date.getTime() / 1e3);
  }
  function inUnixTimeRange(timeUnix) {
    return timeUnix >= MIN_UNIX_TIME && timeUnix <= MAX_UNIX_TIME;
  }
  function clampUnixTime(timeUnix) {
    return Math.min(MAX_UNIX_TIME, Math.max(MIN_UNIX_TIME, timeUnix));
  }
  function getOptionValue2(zipWriter, options, name, defaultValue) {
    const result = options[name] === UNDEFINED_VALUE ? zipWriter.options[name] : options[name];
    return result === UNDEFINED_VALUE ? defaultValue : result;
  }
  function getDateOptionValue(zipWriter, options, name, defaultValue) {
    const date = getOptionValue2(zipWriter, options, name, defaultValue);
    if (date === null) {
      return defaultValue;
    }
    if (date !== UNDEFINED_VALUE && (typeof date.getTime != FUNCTION_TYPE || Number.isNaN(date.getTime()))) {
      throw new Error(ERR_INVALID_DATE);
    }
    return date;
  }
  function getFunctionOptionValue2(zipWriter, options, name) {
    return checkFunctionOption(getOptionValue2(zipWriter, options, name));
  }
  function getNumberOptionValue(zipWriter, options, name, defaultValue) {
    return toNumber(getOptionValue2(zipWriter, options, name, defaultValue));
  }
  function getMaximumCompressedSize(uncompressedSize) {
    return uncompressedSize + 5 * (Math.floor(uncompressedSize / 16383) + 1);
  }
  function isCompressed(compressionMethod, level) {
    return compressionMethod === UNDEFINED_VALUE ? level === UNDEFINED_VALUE || level > 0 : compressionMethod !== COMPRESSION_METHOD_STORE;
  }
  function getUint162(view, offset) {
    return view.getUint16(offset, true);
  }
  function getUint322(view, offset) {
    return view.getUint32(offset, true);
  }
  function setUint8(view, offset, value) {
    view.setUint8(offset, value);
  }
  function setUint16(view, offset, value) {
    view.setUint16(offset, value, true);
  }
  function setUint32(view, offset, value) {
    view.setUint32(offset, value, true);
  }
  function setBigUint64(view, offset, value) {
    view.setBigUint64(offset, value, true);
  }
  function arraySet(array, typedArray, offset) {
    array.set(typedArray, offset);
  }
  function getLength(...arrayLikes) {
    let result = 0;
    arrayLikes.forEach((arrayLike) => arrayLike && (result += arrayLike.length));
    return result;
  }
  function getHeaderArrayData({
    version,
    bitFlag,
    compressionMethod,
    uncompressedSize,
    compressedSize,
    lastModDate,
    rawLastModDate,
    rawFilename,
    zip64CompressedSize,
    zip64UncompressedSize,
    extraFieldLength
  }) {
    const headerRecord = createRecordWriter(HEADER_SIZE - 4);
    const headerArray = headerRecord.array;
    const headerView = getDataView(headerArray);
    headerRecord.writeUint16(version);
    headerRecord.writeUint16(bitFlag);
    headerRecord.writeUint16(compressionMethod);
    if (rawLastModDate === UNDEFINED_VALUE) {
      const dateArray = new Uint32Array(1);
      const dateView = getDataView(dateArray);
      setUint16(dateView, 0, (lastModDate.getHours() << 6 | lastModDate.getMinutes()) << 5 | lastModDate.getSeconds() / 2);
      setUint16(dateView, 2, (lastModDate.getFullYear() - 1980 << 4 | lastModDate.getMonth() + 1) << 5 | lastModDate.getDate());
      rawLastModDate = dateArray[0];
    }
    headerRecord.writeUint32(rawLastModDate);
    headerRecord.skip(4);
    if (zip64CompressedSize || compressedSize !== UNDEFINED_VALUE) {
      headerRecord.writeUint32(zip64CompressedSize ? MAX_32_BITS : compressedSize);
    } else {
      headerRecord.skip(4);
    }
    if (zip64UncompressedSize || uncompressedSize !== UNDEFINED_VALUE) {
      headerRecord.writeUint32(zip64UncompressedSize ? MAX_32_BITS : uncompressedSize);
    } else {
      headerRecord.skip(4);
    }
    headerRecord.writeUint16(getLength(rawFilename));
    headerRecord.writeUint16(extraFieldLength);
    return {
      headerArray,
      headerView,
      rawLastModDate
    };
  }
  function isPrintableASCIIText(rawText) {
    return rawText.every((characterCode) => characterCode >= MIN_PRINTABLE_ASCII_CHARACTER_CODE && characterCode <= MAX_PRINTABLE_ASCII_CHARACTER_CODE);
  }
  function getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod) {
    let bitFlag = 0;
    if (useUnicodeFileNames) {
      bitFlag = bitFlag | BITFLAG_LANG_ENCODING_FLAG;
    }
    if (dataDescriptor) {
      bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
    }
    if (compressionMethod == COMPRESSION_METHOD_DEFLATE || compressionMethod == COMPRESSION_METHOD_DEFLATE_64) {
      if (level >= 0 && level <= 3) {
        bitFlag = bitFlag | BITFLAG_LEVEL_SUPER_FAST_MASK;
      }
      if (level > 3 && level <= 5) {
        bitFlag = bitFlag | BITFLAG_LEVEL_FAST_MASK;
      }
      if (level == 9) {
        bitFlag = bitFlag | BITFLAG_LEVEL_MAX_MASK;
      }
    }
    if (encrypted) {
      bitFlag = bitFlag | BITFLAG_ENCRYPTED;
    }
    return bitFlag;
  }

  // ../../node_modules/@zip.js/zip.js/lib/zip-core-base.js
  init_io();
  init_options();
  init_configuration();
  init_codec_registry();

  // ../../node_modules/@zip.js/zip.js/lib/core/compression-methods.js
  init_constants();
  init_configuration();
  init_codec_registry();
  init_zip_entry_stream();

  // ../../node_modules/@zip.js/zip.js/lib/core/util/opfs-temp-stream.js
  var DEFAULT_THRESHOLD = 1024 * 1024;

  // ../../node_modules/@zip.js/zip.js/lib/core/util/blob-temp-stream.js
  init_compatible_streams();
  var DEFAULT_THRESHOLD2 = 1024 * 1024;

  // ../../node_modules/@zip.js/zip.js/lib/core/util/sync-access-handle-temp-stream.js
  var DEFAULT_THRESHOLD3 = 1024 * 1024;
  var READ_CHUNK_SIZE = 512 * 1024;

  // ../../node_modules/@zip.js/zip.js/lib/zip-core-base.js
  var import_meta = {};
  try {
    setDefaultConfiguration({ baseURI: import_meta.url });
  } catch {
  }

  // ../../node_modules/@zip.js/zip.js/lib/zip-module-native.js
  init_configuration();

  // ../../node_modules/@zip.js/zip.js/lib/core/streams/zlib-js/zlib-streams.min.js
  var { Uint8Array: p, Uint16Array: g, Int32Array: R, TransformStream: H, Math: O, Error: z, Array: k } = globalThis;
  var pe = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  var Z = new p(0);
  var qe = new g(0);
  var de = [];
  for (let e = 0; e < 6; e++) de.push(e, 0 == e ? 8 : 4);
  de.push(0, 1);
  var Se = [];
  for (let e = 0; e < 14; e++) Se.push(e, 0 == e ? 4 : 2);
  var Ee = new g([0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576]);
  var ge = new g([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0]);
  function M(e, t, n, r, i) {
    if (0 == i) return;
    let f = e instanceof p ? e : new p(e.buffer, e.byteOffset, e.byteLength), l = n instanceof p ? n.subarray(r, r + i) : new p(n.buffer, n.byteOffset + r, i);
    f.set(l, t);
  }
  function Ve(e, t, n) {
    0 != n && (e instanceof p ? e : new p(e.buffer, e.byteOffset, e.byteLength)).fill(0, t, t + n);
  }
  function je() {
    return { next_in: Z, next_in_index: 0, avail_in: 0, total_in: 0, next_out: Z, next_out_index: 0, avail_out: 0, total_out: 0, msg: "", t: 0, i: 0, l: 0, _: void 0 };
  }
  function $e(e, t) {
    let n = 1 << t;
    return { o: e, u: new p(n), h: n, k: t, m: 0, v: 0, p: 0, T: 0 };
  }
  function te(e) {
    let t = [];
    for (let n = 0; n < e.length; n += 2) {
      let r = e[n], i = e[n + 1];
      for (let e2 = 0; e2 < i; e2++) t.push(r);
    }
    return new g(t);
  }
  var ne = class {
    constructor(e, t) {
      this.I = e, this.M = t, this.C = 0;
    }
  };
  var re = class {
    constructor(e, t, n, r, i) {
      this.Z = e, this.W = t, this.q = n, this.O = r, this.S = i;
    }
  };
  function D_(e) {
    return J_[e < -6 || e > 2 ? 9 : 2 - e] || "";
  }
  function we(e, t) {
    try {
      e.msg = D_(t);
    } catch (n) {
      e.msg = "zlib error " + String(t) + " (" + n + ")";
    }
    return t;
  }
  function Qe(e, t) {
    let n = e >>> 0, r = 0;
    for (let e2 = 0; e2 < t; e2++) r = r << 1 | 1 & n, n >>>= 1;
    return r;
  }
  function T8(e, t) {
    e.D[e.j++] = t;
  }
  function Ae(e, t) {
    T8(e, 255 & t), T8(e, t >>> 8 & 255);
  }
  function e_(e, t, n) {
    let r = 255 & n, i = 65535 & t, f = e.A + e.N;
    return e.D[f] = 255 & i, e.D[f + 1] = i >>> 8 & 255, e.D[f + 2] = r, e.N += 3, i = i - 1 & 65535, e.H[__[r] + ie + 1].R++, e.J[y_(i)].R++, e.N == e.U;
  }
  function De(e, t) {
    let n = 255 & t, r = e.A + e.N;
    return e.D[r] = 0, e.D[r + 1] = 0, e.D[r + 2] = n, e.N += 3, e.H[n].R++, e.N == e.U;
  }
  function ye(e) {
    return e.h - ae;
  }
  function y_(e) {
    return e < 256 ? A_[e] : A_[256 + (e >> 7)];
  }
  function v_(e) {
    let t = Ce + 7, n = 1 << t, r = (1 << t) - 1, i = O.floor((t + I - 1) / I), f = 1 << 8 + Ce;
    return { ...$e(e, 15), o: e, Y: 42, P: 0, B: void 0, F: 32767, G: t, V: n, L: r, X: i, $: new g(32768), K: new g(n), ee: f, D: new p(32768), te: 0, ne: 32768, j: 0, re: 0, ie: 0, fe: 0, le: 0, _e: 0, oe: -2, ae: 0, ue: 0, ce: 0, se: 0, he: 0, de: 0, we: 0, be: 0, ke: 0, ge: 0, me: 0, ve: 0, pe: 0, xe: 0, Te: new R(2 * Te + 1), ye: new p(2 * Te + 1), Ie: new g(be + 1), N: 0, U: 0, Me: Z, A: 0, ze: 0, Ce: 0, Ze: 8, We: 32768, qe: 0, Oe: 0, Se: 0, H: new k(fe).fill(0).map(() => J()), J: new k(2 * me + 1).fill(0).map(() => J()), De: new k(2 * oe + 1).fill(0).map(() => J()), je: w_(), Ae: w_(), Qe: w_() };
  }
  function I_(e) {
    let t = [];
    for (let n = 0; n < e.length; n += 2) {
      let r = e[n], i = e[n + 1], f = J();
      f.Ne = r, f.Re = i, t.push(f);
    }
    return t;
  }
  function J() {
    return { R: 0, Ne: 0, He: 0, Re: 0 };
  }
  function w_() {
    return new ne([], bn(null, Z, 0, 0, 0));
  }
  function bn(e, t, n, r, i) {
    return new re(e, t, n, r, i);
  }
  function Q_() {
    let e = new k(288).fill(0);
    for (let t = 0; t <= 143; t++) e[t] = 8;
    for (let t = 144; t <= 255; t++) e[t] = 9;
    for (let t = 256; t <= 279; t++) e[t] = 7;
    for (let t = 280; t <= 287; t++) e[t] = 8;
    return e;
  }
  function k_(e) {
    let { code: t, length: n } = sn(e), r = new g(2 * e.length), i = 0;
    for (let f = 0; f < e.length; f++) {
      let e2 = n[f] || 0, l = t[f] || 0;
      r[i++] = e2 ? Qe(l, e2) : 0, r[i++] = e2;
    }
    return new g(r);
  }
  function et(e, t, n) {
    let r = 0;
    for (let n2 = 0; n2 < e.length; n2++) {
      let i2 = t[n2] ? 1 << t[n2] : 1, f2 = e[n2] + i2 - 1;
      f2 > r && (r = f2);
    }
    r < n && (r = n);
    let i = new p(r + 1);
    for (let n2 = 0; n2 <= r; n2++) for (let r2 = 0; r2 < e.length; r2++) {
      let f2 = t[r2] ? 1 << t[r2] : 1, l = e[r2];
      if (n2 >= l && n2 <= l + f2 - 1) {
        i[n2] = r2;
        break;
      }
    }
    let f = 0;
    for (let n2 = 0; n2 < e.length - 1; n2++) {
      let r2 = t[n2] ? 1 << t[n2] : 1, i2 = e[n2] + r2 - 1;
      i2 > f && (f = i2);
    }
    return i[f] = e.length - 1, i;
  }
  function _t(e, t) {
    let n = 0;
    for (let r2 = 0; r2 < e.length; r2++) {
      let i = t[r2] ? 1 << t[r2] : 1, f = e[r2] + i - 1;
      f > n && (n = f);
    }
    let r = new p(n + 1);
    for (let i = 0; i <= n; i++) for (let n2 = 0; n2 < e.length; n2++) {
      let f = t[n2] ? 1 << t[n2] : 1, l = e[n2];
      if (i >= l && i <= l + f - 1) {
        r[i] = n2;
        break;
      }
    }
    return r;
  }
  function tt(e) {
    let t = new p(512), n = e.length - 1;
    for (let r = 0; r < 256; r++) t[r] = r <= n ? e[r] : e[n];
    for (let r = 256; r <= n; r++) {
      let n2 = r >> 7;
      t[256 + (n2 > 255 ? 255 : n2)] = e[r];
    }
    for (let e2 = 257; e2 < 512; e2++) 0 == t[e2] && (t[e2] = t[e2 - 1]);
    return t;
  }
  function sn(e) {
    let t = O.max(...e), n = new k(t + 1).fill(0);
    for (let t2 of e) t2 > 0 && n[t2]++;
    let r = new k(e.length).fill(0), i = new k(t + 1).fill(0), f = 0;
    for (let e2 = 1; e2 <= t; e2++) f = f + n[e2 - 1] << 1, i[e2] = f;
    for (let t2 = 0; t2 < e.length; t2++) {
      let n2 = e[t2];
      0 != n2 && (r[t2] = i[n2]++);
    }
    return { code: r, length: e };
  }
  var Ce = 8;
  var I = 3;
  var ee = 258;
  var ae = ee + I + 1;
  var nt = 4096;
  var Ue = 16;
  var He = ee;
  var hn = 29;
  var ie = 256;
  var Te = ie + 1 + hn;
  var me = 30;
  var oe = 19;
  var fe = 2 * Te + 1;
  var be = 15;
  var rt = 9;
  var at = 255;
  var it = 32;
  var ot = 4;
  var ve = 256;
  var t_ = 16;
  var n_ = 17;
  var r_ = 18;
  var ft = 0;
  var N_ = 1;
  var lt = 2;
  var Q = -1;
  var J_ = ["need dictionary", "stream end", "", "file error", "stream error", "data error", "insufficient memory", "buffer error", ""];
  var a_ = te(de);
  var i_ = te(Se);
  var Be = new g(19);
  Be[16] = 2, Be[17] = 3, Be[18] = 7;
  var xn = k_(Q_());
  var pn = k_(new k(30).fill(5));
  var Fe = I_(xn);
  var R_ = I_(pn);
  var __ = et(ge, a_, ee);
  var A_ = tt(_t(Ee, i_));
  function se(e, t, n) {
    if (void 0 === t || void 0 === n) return 1;
    let r = 65535 & e, i = e >>> 16 & 65535, f = 0;
    for (; n > 0; ) {
      let e2 = n > 2e3 ? 2e3 : n;
      n -= e2;
      do {
        r = r + t[f++] | 0, i = i + r | 0;
      } while (--e2);
      r %= 65521, i %= 65521;
    }
    return (i << 16 | r) >>> 0;
  }
  var Ze = [[], [], [], [], [], [], [], []];
  for (let e = 0; e < 256; e++) {
    let t = e;
    for (let e2 = 0; e2 < 8; e2++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
    Ze[0][e] = t;
  }
  for (let e = 0; e < 256; e++) for (let t = 1; t < 8; t++) {
    let n = Ze[t - 1][e];
    Ze[t][e] = n >>> 8 ^ Ze[0][255 & n];
  }
  var [ut, Sn, En, gn, Tn, wn, An, Dn] = Ze;
  function W(e = 0, t, n) {
    if (!t) return 0;
    void 0 === n && (n = t.length);
    let r = 0 | ~e, i = 0;
    if ((n = O.min(n, t.length)) >= 8) {
      let e2 = new DataView(t.buffer, t.byteOffset, n), f = n - 8;
      for (; i <= f; i += 8) {
        let t2 = r ^ e2.getInt32(i, true), n2 = e2.getInt32(i + 4, true);
        r = Dn[255 & t2] ^ An[t2 >>> 8 & 255] ^ wn[t2 >>> 16 & 255] ^ Tn[t2 >>> 24 & 255] ^ gn[255 & n2] ^ En[n2 >>> 8 & 255] ^ Sn[n2 >>> 16 & 255] ^ ut[n2 >>> 24 & 255];
      }
    }
    for (; i < n; i++) r = r >>> 8 ^ ut[255 & (r ^ t[i])];
    return (4294967295 ^ r) >>> 0;
  }
  function xt(e) {
    16 == e.T ? (Ae(e, e.p), e.p = 0, e.T = 0) : e.T >= 8 && (T8(e, e.p), e.p >>= 8, e.T -= 8);
  }
  function pt(e) {
    e.T > 8 ? Ae(e, e.p) : e.T > 0 && T8(e, e.p), e.ze = 1 + (e.T - 1 & 7), e.p = 0, e.T = 0;
  }
  function yn(e, t, n) {
    let r, i, f = [], l = 0;
    for (r = 1; r <= be; r++) l = l + n[r - 1] << 1, f[r] = l;
    for (i = 0; i <= t; i++) {
      let t2 = e[i].Re;
      0 != t2 && (e[i].Ne = Qe(f[t2]++, t2));
    }
  }
  function C(e, t, n) {
    e.T > Ue - n ? (e.p = 65535 & (e.p | t << e.T), Ae(e, e.p), e.p = t >> Ue - e.T & 65535, e.T += n - Ue) : (e.p = 65535 & (e.p | t << e.T), e.T += n);
  }
  function St(e) {
    for (let t = 0; t < e.H.length; t++) e.H[t].R = 0;
    for (let t = 0; t < e.J.length; t++) e.J[t].R = 0;
    for (let t = 0; t < e.De.length; t++) e.De[t].R = 0;
    e.H[ve].R = 1, e.ie = e.fe = 0, e.N = e.le = 0;
  }
  function Et(e) {
    if (e.H && e.H.length >= fe) for (let t = 0; t < fe; t++) e.H[t] = J();
    else {
      e.H = [];
      for (let t = 0; t < fe; t++) e.H.push(J());
    }
    if (e.J && e.J.length >= 2 * me + 1) for (let t = 0; t < 2 * me + 1; t++) e.J[t] = J();
    else {
      e.J = [];
      for (let t = 0; t < 2 * me + 1; t++) e.J.push(J());
    }
    if (e.De && e.De.length >= 2 * oe + 1) for (let t = 0; t < 2 * oe + 1; t++) e.De[t] = J();
    else {
      e.De = [];
      for (let t = 0; t < 2 * oe + 1; t++) e.De.push(J());
    }
    e.je = new ne(e.H, new re(Fe, a_, ie + 1, Te, be)), e.Ae = new ne(e.J, new re(R_, i_, 0, me, be)), e.Qe = new ne(e.De, new re(null, Be, 0, oe, 7)), e.p = 0, e.T = 0, e.ze = 0, St(e);
  }
  var he = 1;
  function vn(e, t, n) {
    return n = e.Te[he], e.Te[he] = e.Te[e.Oe--], z_(e, t, he), n;
  }
  function mt(e, t, n, r) {
    return e[t].R < e[n].R || e[t].R == e[n].R && r[t] <= r[n];
  }
  function z_(e, t, n) {
    let r = e.Te[n], i = n << 1;
    for (; i <= e.Oe && (i < e.Oe && mt(t, e.Te[i + 1], e.Te[i], e.ye) && i++, !mt(t, r, e.Te[i], e.ye)); ) e.Te[n] = e.Te[i], n = i, i <<= 1;
    e.Te[n] = r;
  }
  function In(e, t) {
    let n, r, i, f, l, _, o = t.I, a = t.C, u = t.M.Z, c = t.M.W, s = t.M.q, h = t.M.S, d = 0;
    for (f = 0; f <= be; f++) e.Ie[f] = 0;
    for (o[e.Te[e.Se]].Re = 0, n = e.Se + 1; n < fe; n++) r = e.Te[n], f = o[o[r].He].Re + 1, f > h && (f = h, d++), o[r].Re = f, !(r > a) && (e.Ie[f]++, l = 0, r >= s && (l = c[r - s]), _ = o[r].R, e.ie += _ * (f + l), u && (e.fe += _ * (u[r].Re + l)));
    if (0 != d) {
      do {
        for (f = h - 1; 0 == e.Ie[f]; ) f--;
        e.Ie[f]--, e.Ie[f + 1] += 2, e.Ie[h]--, d -= 2;
      } while (d > 0);
      for (f = h; 0 != f; f--) for (r = e.Ie[f]; 0 != r; ) i = e.Te[--n], !(i > a) && (o[i].Re != f && (e.ie += (f - o[i].Re) * o[i].R, o[i].Re = f), r--);
    }
  }
  function O_(e, t) {
    let n, r, i, f = t.I, l = t.M.Z, _ = t.M.O, o = -1;
    for (e.Oe = 0, e.Se = fe, n = 0; n < _; n++) 0 != f[n].R ? (e.Te[++e.Oe] = o = n, e.ye[n] = 0) : f[n].Re = 0;
    for (; e.Oe < 2; ) i = e.Te[++e.Oe] = o < 2 ? ++o : 0, f[i].R = 1, e.ye[i] = 0, e.ie--, l && (e.fe -= l[i].Re);
    for (t.C = o, n = O.floor(e.Oe / 2); n >= 1; n--) z_(e, f, n);
    i = _;
    do {
      n = vn(e, f, n), r = e.Te[he], e.Te[--e.Se] = n, e.Te[--e.Se] = r, f[i].R = f[n].R + f[r].R, e.ye[i] = (e.ye[n] >= e.ye[r] ? e.ye[n] : e.ye[r]) + 1, f[n].He = f[r].He = i, e.Te[he] = i++, z_(e, f, he);
    } while (e.Oe >= 2);
    e.Te[--e.Se] = e.Te[he], In(e, t), yn(f, t.C, e.Ie);
  }
  function bt(e, t, n) {
    let r, i, f = -1, l = t[0].Re, _ = 0, o = 7, a = 4;
    for (0 == l && (o = 138, a = 3), t[n + 1].Re = 65535, r = 0; r <= n; r++) i = l, l = t[r + 1].Re, !(++_ < o && i == l) && (_ < a ? e.De[i].R += _ : 0 != i ? (i != f && e.De[i].R++, e.De[t_].R++) : _ <= 10 ? e.De[n_].R++ : e.De[r_].R++, _ = 0, f = i, 0 == l ? (o = 138, a = 3) : i == l ? (o = 6, a = 3) : (o = 7, a = 4));
  }
  function st(e, t, n) {
    let r, i = -1, f = t[0].Re, l = 0, _ = 7, o = 4;
    0 == f && (_ = 138, o = 3);
    for (let a = 0; a <= n; a++) if (r = f, f = t[a + 1].Re, !(++l < _ && r == f)) {
      if (l < o) do {
        C(e, e.De[r].Ne, e.De[r].Re);
      } while (0 != --l);
      else 0 != r ? (r != i && (C(e, e.De[r].Ne, e.De[r].Re), l--), C(e, e.De[t_].Ne, e.De[t_].Re), C(e, l - 3, 2)) : l <= 10 ? (C(e, e.De[n_].Ne, e.De[n_].Re), C(e, l - 3, 3)) : (C(e, e.De[r_].Ne, e.De[r_].Re), C(e, l - 11, 7));
      l = 0, i = r, 0 == f ? (_ = 138, o = 3) : r == f ? (_ = 6, o = 3) : (_ = 7, o = 4);
    }
  }
  function kn(e) {
    let t;
    for (bt(e, e.H, e.je.C), bt(e, e.J, e.Ae.C), O_(e, e.Qe), t = oe - 1; t >= 3 && 0 == e.De[pe[t]].Re; t--) ;
    return e.ie += 3 * (t + 1) + 5 + 5 + 4, t;
  }
  function Nn(e, t, n, r) {
    let i;
    for (C(e, t - 257, 5), C(e, n - 1, 5), C(e, r - 4, 4), i = 0; i < r; i++) C(e, e.De[pe[i]].Re, 3);
    st(e, e.H, t - 1), st(e, e.J, n - 1);
  }
  function Pe(e, t, n, r, i = 0) {
    C(e, (ft << 1) + r, 3), pt(e), Ae(e, n), Ae(e, ~n), n && t && M(e.D, e.j, t, i, n), e.j += n;
  }
  function gt(e) {
    xt(e);
  }
  function Tt(e) {
    C(e, N_ << 1, 3), C(e, Fe[ve].Ne, Fe[ve].Re), xt(e);
  }
  function ht(e, t, n) {
    let r, i, f, l, _ = 0;
    if (0 != e.N) do {
      r = 255 & e.Me[_], r += (255 & e.Me[_ + 1]) << 8, i = e.Me[_ + 2], _ += 3, 0 == r ? C(e, t[i].Ne, t[i].Re) : (f = __[i], C(e, t[f + ie + 1].Ne, t[f + ie + 1].Re), l = a_[f], 0 != l && (i -= ge[f], C(e, i, l)), r--, f = y_(r), C(e, n[f].Ne, n[f].Re), l = i_[f], 0 != l && (r -= Ee[f], C(e, r, l)));
    } while (_ < e.N);
    C(e, t[ve].Ne, t[ve].Re);
  }
  function Rn(e) {
    let t, n = 4093624447;
    for (t = 0; t <= 31; t++, n >>= 1) if (1 & n && 0 != e.H[t].R) return 0;
    if (0 != e.H[9].R || 0 != e.H[10].R || 0 != e.H[13].R) return 1;
    for (t = 32; t < ie; t++) if (0 != e.H[t].R) return 1;
    return 0;
  }
  function wt(e, t, n, r, i = 0) {
    let f, l, _ = 0;
    e.ke > 0 ? (2 == e.o.t && (e.o.t = Rn(e)), O_(e, e.je), O_(e, e.Ae), _ = kn(e), f = e.ie + 3 + 7 >> 3, l = e.fe + 3 + 7 >> 3, (l <= f || 4 == e.ge) && (f = l)) : f = l = n + 5, n + 4 <= f && t ? Pe(e, t, n, r, i) : l == f ? (C(e, (N_ << 1) + r, 3), ht(e, Fe, R_)) : (C(e, (lt << 1) + r, 3), Nn(e, e.je.C + 1, e.Ae.C + 1, _ + 1), ht(e, e.H, e.J)), St(e), r && pt(e);
  }
  function vt() {
    let e = je();
    return e._ = v_(e), e;
  }
  var Ye = [{ Je: Ot, Ue: 0, Ee: 0, Ye: 0, Pe: 0 }, { Je: U_, Ue: 4, Ee: 4, Ye: 8, Pe: 4 }, { Je: U_, Ue: 4, Ee: 5, Ye: 16, Pe: 8 }, { Je: U_, Ue: 4, Ee: 6, Ye: 32, Pe: 32 }, { Je: Ne, Ue: 4, Ee: 4, Ye: 16, Pe: 16 }, { Je: Ne, Ue: 8, Ee: 16, Ye: 32, Pe: 32 }, { Je: Ne, Ue: 8, Ee: 16, Ye: 128, Pe: 128 }, { Je: Ne, Ue: 8, Ee: 32, Ye: 128, Pe: 256 }, { Je: Ne, Ue: 32, Ee: 128, Ye: 258, Pe: 1024 }, { Je: Ne, Ue: 32, Ee: 258, Ye: 258, Pe: 4096 }];
  function At(e) {
    return 2 * e - (e > 4 ? 9 : 0);
  }
  function l_(e, t, n) {
    return ((t << e.X ^ n) & e.L) >>> 0;
  }
  function u_(e, t) {
    e.be = l_(e, e.be, e.u[t + (I - 1)]);
    let n = e.$[t & e.F] = e.K[e.be];
    return e.K[e.be] = t, n;
  }
  function It(e) {
    e.K[e.V - 1] = 0, Ve(e.K, 0, (e.V - 1) * e.K.BYTES_PER_ELEMENT);
  }
  function Bn(e) {
    let t, n, r = e.h;
    for (t = e.V; t > 0; ) t--, n = e.K[t], e.K[t] = n >= r ? n - r : 0;
    for (t = r; t > 0; ) t--, n = e.$[t], e.$[t] = n >= r ? n - r : 0;
  }
  function H_(e, t, n, r) {
    let i = e.avail_in;
    return i > r && (i = r), 0 == i ? 0 : (e.avail_in -= i, M(t, n, e.next_in, e.next_in_index, i), 1 == e._.P ? e.i = se(e.i, new p(t.buffer, t.byteOffset + n, i), i) : 2 == e._.P && (e.i = W(e.i, new p(t.buffer, t.byteOffset + n, i), i)), e.next_in_index += i, e.total_in += i, i);
  }
  function c_(e) {
    let t, n, r = e.h;
    do {
      if (n = e.We - e.ce - e.ue, 0 == n && 0 == e.ue && 0 == e.ce ? n = r : -1 == n && n--, e.ue >= r + ye(e) && (M(e.u, 0, e.u, r, r - n), e.qe -= r, e.ue -= r, e.ae -= r, e._e > e.ue && (e._e = e.ue), Bn(e), n += r), 0 == e.o.avail_in) break;
      if (t = H_(e.o, e.u, e.ue + e.ce, n), e.ce += t, e.ce + e._e >= I) {
        let t2 = e.ue - e._e;
        for (e.be = e.u[t2], e.be = l_(e, e.be, e.u[t2 + 1]); e._e && (e.be = l_(e, e.be, e.u[t2 + I - 1]), e.$[t2 & e.F] = e.K[e.be], e.K[e.be] = t2, t2++, e._e--, !(e.ce + e._e < I)); ) ;
      }
    } while (e.ce < ae && 0 != e.o.avail_in);
    if (e.m < e.We) {
      let t2, n2 = e.ue + e.ce;
      e.m < n2 ? (t2 = e.We - n2, t2 > He && (t2 = He), Ve(e.u, n2, t2), e.m = n2 + t2) : e.m < n2 + He && (t2 = n2 + He - e.m, t2 > e.We - e.m && (t2 = e.We - e.m), Ve(e.u, e.m, t2), e.m += t2);
    }
  }
  function kt(e, t, n = 8, r = 15, i = Ce, f = 0) {
    let l = 1;
    if (!e) return -2;
    if (e.msg = "", -1 == t && (t = 6), r < 0) {
      if (l = 0, r < -15) return -2;
      r = -r;
    } else r > 15 && (l = 2, r -= 16);
    if (i < 1 || i > rt || 8 != n || r < 8 || r > 15 || t < 0 || t > 9 || f < 0 || f > 4 || 8 == r && 1 != l) return -2;
    8 == r && (r = 9);
    let _ = v_(e);
    return _ ? (e._ = _, _.o = e, _.Y = 42, _.P = l, _.B = void 0, _.k = r, _.h = 1 << _.k, _.F = _.h - 1, _.G = i + 7, _.V = 1 << _.G, _.L = _.V - 1, _.X = (_.G + I - 1) / I, _.u = new p(2 * _.h), _.$ = new g(_.h), _.K = new g(_.V), _.m = 0, _.ee = 1 << i + 6, _.D = new p(_.ee * ot), _.ne = 4 * _.ee, _.u && _.$ && _.K && _.D ? (_.Me = _.D.subarray(_.ee), _.A = _.te + _.ee, _.U = 3 * (_.ee - 1), _.ke = t, _.ge = f, _.Ze = n, Pn(e)) : (_.Y = 666, e.msg = D_(-4), P_(e), -4)) : -4;
  }
  function Z_(e) {
    if (null == e) return true;
    let t = e._;
    return !t || t.o != e || 42 != t.Y && 57 != t.Y && 69 != t.Y && 73 != t.Y && 91 != t.Y && 103 != t.Y && 113 != t.Y && 666 != t.Y;
  }
  function Fn(e) {
    let t;
    return Z_(e) ? -2 : (e.total_in = e.total_out = 0, e.msg = "", e.t = 2, t = e._, t.j = 0, t.re = t.te, t.P < 0 && (t.P = -t.P), t.Y = 2 == t.P ? 57 : 42, e.i = 2 == t.P ? W(0) : se(0), t.oe = -2, Et(t), 0);
  }
  function Zn(e) {
    e.We = 2 * e.h, It(e), e.xe = Ye[e.ke].Ee, e.me = Ye[e.ke].Ue, e.ve = Ye[e.ke].Ye, e.pe = Ye[e.ke].Pe, e.ue = 0, e.ae = 0, e.ce = 0, e._e = 0, e.se = e.he = I - 1, e.we = 0, e.be = 0;
  }
  function Pn(e) {
    let t = Fn(e);
    return 0 == t && Zn(e._), t;
  }
  function Me(e, t) {
    T8(e, t >> 8), T8(e, 255 & t);
  }
  function q(e) {
    let t, n = e._;
    gt(n), t = n.j, t > e.avail_out && (t = e.avail_out), 0 != t && (M(e.next_out, e.next_out_index, n.D, n.re, t), e.next_out_index += t, n.re += t, e.total_out += t, e.avail_out -= t, n.j -= t, 0 == n.j && (n.re = n.te));
  }
  function Ie(e, t) {
    let n = e._;
    n.B && n.B.Be && (e.i = W(e.i, new p(n.D.buffer, n.te + t, n.j - t), n.j - t));
  }
  function Nt(e, t) {
    let n, r = e._;
    if (Z_(e) || t > 5 || t < 0) return we(e, -2);
    if (!e.next_out || 0 != e.avail_in && !e.next_in || 666 == r.Y && 4 != t) return we(e, -2);
    if (0 == e.avail_out) return we(e, -5);
    if (n = r.oe, r.oe = t, 0 != r.j) {
      if (q(e), 0 == e.avail_out) return r.oe = Q, 0;
    } else if (0 == e.avail_in && At(t) <= At(n) && 4 != t) return we(e, -5);
    if (666 == r.Y && 0 != e.avail_in) return we(e, -5);
    if (42 == r.Y && 0 == r.P && (r.Y = 113), 42 == r.Y) {
      let t2, n2 = 8 + (r.k - 8 << 4) << 8;
      if (t2 = r.ge >= 2 || r.ke < 2 ? 0 : r.ke < 6 ? 1 : 6 == r.ke ? 2 : 3, n2 |= t2 << 6, 0 != r.ue && (n2 |= it), n2 += 31 - n2 % 31, Me(r, n2), 0 != r.ue && (Me(r, e.i >> 16), Me(r, 65535 & e.i)), e.i = 1, r.Y = 113, q(e), 0 != r.j) return r.oe = Q, 0;
    }
    if (57 == r.Y) {
      if (e.i = W(0), T8(r, 31), T8(r, 139), T8(r, 8), r.B) T8(r, (r.B.Fe ? 1 : 0) + (r.B.Be ? 2 : 0) + (null == r.B.Ge ? 0 : 4) + (null == r.B.Ve ? 0 : 8) + (null == r.B.Le ? 0 : 16)), T8(r, 255 & r.B.Xe), T8(r, r.B.Xe >>> 8 & 255), T8(r, r.B.Xe >>> 16 & 255), T8(r, r.B.Xe >>> 24 & 255), T8(r, 9 == r.ke ? 2 : r.ge >= 2 || r.ke < 2 ? 4 : 0), T8(r, 255 & r.B.$e), null != r.B.Ge && (T8(r, 255 & r.B.Ke), T8(r, r.B.Ke >>> 8 & 255)), r.B.Be && (e.i = W(e.i, r.D, r.j)), r.Ce = 0, r.Y = 69;
      else if (T8(r, 0), T8(r, 0), T8(r, 0), T8(r, 0), T8(r, 0), T8(r, 9 == r.ke ? 2 : r.ge >= 2 || r.ke < 2 ? 4 : 0), T8(r, at), r.Y = 113, q(e), 0 != r.j) return r.oe = Q, 0;
    }
    if (69 == r.Y) {
      if (r.B && null != r.B.Ge) {
        let t2 = r.j, n2 = (65535 & r.B.Ke) - r.Ce;
        for (; r.j + n2 > r.ne; ) {
          let i = r.ne - r.j;
          if (M(r.D, r.j, r.B.Ge, r.Ce, i), r.j = r.ne, Ie(e, t2), r.Ce += i, q(e), 0 != r.j) return r.oe = Q, 0;
          t2 = 0, n2 -= i;
        }
        M(r.D, r.j, r.B.Ge, r.Ce, n2), r.j += n2, Ie(e, t2), r.Ce = 0;
      }
      r.Y = 73;
    }
    if (73 == r.Y) {
      if (r.B && r.B.Ve && r.B.Ve.length) {
        let t2, n2 = r.j;
        do {
          if (r.j == r.ne) {
            if (Ie(e, n2), q(e), 0 != r.j) return r.oe = Q, 0;
            n2 = 0;
          }
          t2 = r.B.Ve[r.Ce++], T8(r, t2);
        } while (0 != t2);
        Ie(e, n2), r.Ce = 0;
      }
      r.Y = 91;
    }
    if (91 == r.Y) {
      if (r.B && r.B.Le && r.B.Le.length) {
        let t2, n2 = r.j;
        do {
          if (r.j == r.ne) {
            if (Ie(e, n2), q(e), 0 != r.j) return r.oe = Q, 0;
            n2 = 0;
          }
          t2 = r.B.Le[r.Ce++], T8(r, t2);
        } while (0 != t2);
        Ie(e, n2);
      }
      r.Y = 103;
    }
    if (103 == r.Y) {
      if (r.B && r.B.Be) {
        if (r.j + 2 > r.ne && (q(e), 0 != r.j)) return r.oe = Q, 0;
        T8(r, 255 & e.i), T8(r, e.i >>> 8 & 255), e.i = W(0);
      }
      if (r.Y = 113, q(e), 0 != r.j) return r.oe = Q, 0;
    }
    if (0 != e.avail_in || 0 != r.ce || 0 != t && 666 != r.Y) {
      let n2 = 0 == r.ke ? Ot(r, t) : 2 == r.ge ? Yn(r, t) : 3 == r.ge ? Mn(r, t) : Ye[r.ke].Je(r, t);
      if ((2 == n2 || 3 == n2) && (r.Y = 666), 0 == n2 || 2 == n2) return 0 == e.avail_out && (r.oe = Q), 0;
      if (1 == n2 && (1 == t ? Tt(r) : 5 != t && (Pe(r, null, 0, 0), 3 == t && (It(r), 0 == r.ce && (r.ue = 0, r.ae = 0, r._e = 0))), q(e), 0 == e.avail_out)) return r.oe = Q, 0;
    }
    return 4 != t ? 0 : r.P <= 0 ? 1 : (2 == r.P ? (T8(r, 255 & e.i), T8(r, e.i >>> 8 & 255), T8(r, e.i >>> 16 & 255), T8(r, e.i >>> 24 & 255), T8(r, 255 & e.total_in), T8(r, e.total_in >>> 8 & 255), T8(r, e.total_in >>> 16 & 255), T8(r, e.total_in >>> 24 & 255)) : (Me(r, e.i >>> 16 & 65535), Me(r, 65535 & e.i)), q(e), r.P > 0 && (r.P = -r.P), 0 != r.j ? 0 : 1);
  }
  function P_(e) {
    if (Z_(e)) return -2;
    let t = e._, n = t.Y;
    return t.u = Z, t.$ = qe, t.K = qe, t.D = Z, t.Me = Z, t.Te = new R(0), t.ye = Z, t.Ie = qe, t.H.length = 0, t.J.length = 0, t.De.length = 0, t.B = void 0, t.te = 0, t.re = 0, t.A = 0, 113 == n ? -3 : 0;
  }
  function Rt(e, t) {
    let n, r, i = e.pe, f = e.ue, l = e.he, _ = e.ve, o = e.ue > ye(e) ? e.ue - ye(e) : 0, a = e.$, u = e.F, c = e.u, s = e.ce, h = ee < s ? ee : s, d = c[f], w = c[f + 1], b = c[f + l - 1], k2 = c[f + l];
    l >= e.me && (i >>= 2), _ > s && (_ = s);
    do {
      if (n = t, c[n + l] != k2 || c[n + l - 1] != b || c[n] != d || c[n + 1] != w) continue;
      let i2 = 2;
      for (; i2 < h && c[f + i2] == c[n + i2]; ) i2++;
      if (r = i2, r > l) {
        if (e.qe = t, l = r, r >= _) break;
        b = c[f + l - 1], k2 = c[f + l];
      }
    } while ((t = a[t & u]) > o && 0 != --i);
    return l <= s ? l : s;
  }
  function zt(e, t) {
    wt(e, e.u, e.ue - e.ae, t, e.ae), e.ae = e.ue, q(e.o);
  }
  function j(e, t) {
    return zt(e, t ? 1 : 0), 0 == e.o.avail_out ? t ? 2 : 0 : null;
  }
  var Dt = 65535;
  function ke(e, t) {
    return e < t ? e : t;
  }
  function Ot(e, t) {
    let n, r, i, f = ke(e.ne - 5, e.h), l = 0, _ = e.o.avail_in;
    do {
      if (n = Dt, i = e.T + 42 >> 3, e.o.avail_out < i || (i = e.o.avail_out - i, r = e.ue - e.ae, n > r + e.o.avail_in && (n = r + e.o.avail_in), n > i && (n = i), n < f && (0 == n && 4 != t || 0 == t || n != r + e.o.avail_in))) break;
      l = 4 == t && n == r + e.o.avail_in ? 1 : 0, Pe(e, null, 0, l), e.D[e.j - 4] = n, e.D[e.j - 3] = n >> 8, e.D[e.j - 2] = ~n, e.D[e.j - 1] = ~n >> 8, q(e.o), r && (r > n && (r = n), M(e.o.next_out, e.o.next_out_index, e.u, e.ae, r), e.o.next_out_index += r, e.o.avail_out -= r, e.o.total_out += r, e.ae += r, n -= r), n && (H_(e.o, e.o.next_out, e.o.next_out_index, n), e.o.next_out_index += n, e.o.avail_out -= n, e.o.total_out += n);
    } while (0 == l);
    if (_ -= e.o.avail_in, _) {
      if (_ >= e.h) {
        e.le = 2;
        let t2 = e.o.next_in_index - e.h;
        M(e.u, 0, e.o.next_in, t2, e.h), e.ue = e.h, e._e = e.ue;
      } else e.We - e.ue <= _ && (e.ue -= e.h, M(e.u, 0, e.u, e.h, e.ue), e.le < 2 && e.le++, e._e > e.ue && (e._e = e.ue)), M(e.u, e.ue, e.o.next_in, e.o.next_in_index - _, _), e.ue += _, e._e += ke(_, e.h - e._e);
      e.ae = e.ue;
    }
    return e.m < e.ue && (e.m = e.ue), l ? (e.ze = 8, 3) : 0 != t && 4 != t && 0 == e.o.avail_in && e.ue == e.ae ? 1 : (i = e.We - e.ue, e.o.avail_in > i && e.ae >= e.h && (e.ae -= e.h, e.ue -= e.h, M(e.u, 0, e.u, e.h, e.ue), e.le < 2 && e.le++, i += e.h, e._e > e.ue && (e._e = e.ue)), i > e.o.avail_in && (i = e.o.avail_in), i && (H_(e.o, e.u, e.ue, i), e.ue += i, e._e += ke(i, e.h - e._e)), e.m < e.ue && (e.m = e.ue), i = e.T + 42 >> 3, i = ke(e.ne - i, Dt), f = ke(i, e.h), r = e.ue - e.ae, (r >= f || (r || 4 == t) && 0 != t && 0 == e.o.avail_in && r <= i) && (n = ke(r, i), l = 4 == t && 0 == e.o.avail_in && n == r ? 1 : 0, Pe(e, e.u, n, l, e.ae), e.ae += n, q(e.o)), l && (e.ze = 8), l ? 2 : 0);
  }
  function U_(e, t) {
    let n, r = false;
    for (; ; ) {
      if (e.ce < ae) {
        if (c_(e), e.ce < ae && 0 == t) return 0;
        if (0 == e.ce) break;
      }
      if (n = 0, e.ce >= I && (n = u_(e, e.ue)), 0 != n && e.ue - n <= ye(e) && (e.se = Rt(e, n)), e.se >= I) if (e.ue, e.qe, e.se, r = e_(e, e.ue - e.qe, e.se - I), e.ce -= e.se, e.se <= e.xe && e.ce >= I) {
        e.se--;
        do {
          e.ue++, n = u_(e, e.ue);
        } while (0 != --e.se);
        e.ue++;
      } else e.ue += e.se, e.se = 0, e.be = e.u[e.ue], e.be = l_(e, e.be, e.u[e.ue + 1]);
      else r = De(e, e.u[e.ue]), e.ce--, e.ue++;
      if (r) {
        let t2 = j(e, false);
        if (null != t2) return t2;
      }
    }
    if (e._e = e.ue < I - 1 ? e.ue : I - 1, 4 == t) {
      let t2 = j(e, true);
      return null != t2 ? t2 : 3;
    }
    if (e.N) {
      let t2 = j(e, false);
      if (null != t2) return t2;
    }
    return 1;
  }
  function Ne(e, t) {
    let n, r = false;
    for (; ; ) {
      if (e.ce < ae) {
        if (c_(e), e.ce < ae && 0 == t) return 0;
        if (0 == e.ce) break;
      }
      if (n = 0, e.ce >= I && (n = u_(e, e.ue)), e.he = e.se, e.de = e.qe, e.se = I - 1, 0 != n && e.he < e.xe && e.ue - n <= ye(e) && (e.se = Rt(e, n), e.se <= 5 && (1 == e.ge || e.se == I && e.ue - e.qe > nt) && (e.se = I - 1)), e.he >= I && e.se <= e.he) {
        let t2 = e.ue + e.ce - I;
        e.ue, e.de, e.he, r = e_(e, e.ue - 1 - e.de, e.he - I), e.ce -= e.he - 1, e.he -= 2;
        do {
          ++e.ue <= t2 && (n = u_(e, e.ue));
        } while (0 != --e.he);
        if (e.we = 0, e.se = I - 1, e.ue++, r) {
          let t3 = j(e, false);
          if (null != t3) return t3;
        }
      } else if (e.we) {
        if (r = De(e, e.u[e.ue - 1]), r && zt(e, 0), e.ue++, e.ce--, 0 == e.o.avail_out) return 0;
      } else e.we = 1, e.ue++, e.ce--;
    }
    if (e.we && (r = De(e, e.u[e.ue - 1]), e.we = 0), e._e = e.ue < I - 1 ? e.ue : I - 1, 4 == t) {
      let t2 = j(e, true);
      return null != t2 ? t2 : 3;
    }
    if (e.N) {
      let t2 = j(e, false);
      if (null != t2) return t2;
    }
    return 1;
  }
  function Mn(e, t) {
    let n, r, i, f;
    for (; ; ) {
      if (e.ce <= ee) {
        if (c_(e), e.ce <= ee && 0 == t) return 0;
        if (0 == e.ce) break;
      }
      if (e.se = 0, e.ce >= I && e.ue > 0 && (i = e.ue - 1, r = e.u[i], r == ++i && r == ++i && r == ++i)) {
        f = e.ue + ee;
        do {
        } while (r == ++i && r == ++i && r == ++i && r == ++i && r == ++i && r == ++i && r == ++i && r == ++i && i < f);
        e.se = ee - (f - i), e.se > e.ce && (e.se = e.ce);
      }
      if (e.se >= I ? (e.ue, e.ue, e.se, n = e_(e, 1, e.se - I), e.ce -= e.se, e.ue += e.se, e.se = 0) : (n = De(e, e.u[e.ue]), e.ce--, e.ue++), n) {
        let t2 = j(e, false);
        if (null != t2) return t2;
      }
    }
    if (e._e = 0, 4 == t) {
      let t2 = j(e, true);
      return null != t2 ? t2 : 3;
    }
    if (e.N) {
      let t2 = j(e, false);
      if (null != t2) return t2;
    }
    return 1;
  }
  function Yn(e, t) {
    let n = false;
    for (; ; ) {
      if (0 == e.ce && (c_(e), 0 == e.ce)) {
        if (0 == t) return 0;
        break;
      }
      if (e.se = 0, n = De(e, e.u[e.ue]), e.ce--, e.ue++, n) {
        let t2 = j(e, false);
        if (null != t2) return t2;
      }
    }
    if (e._e = 0, 4 == t) {
      let t2 = j(e, true);
      return null != t2 ? t2 : 3;
    }
    if (e.N) {
      let t2 = j(e, false);
      if (null != t2) return t2;
    }
    return 1;
  }
  var ue = 852;
  var d_ = 592;
  var m_ = 594;
  var Lt = Ee.map((e) => e + 1);
  var Ct = ge.subarray(0, -1).map((e) => e + 3);
  var Xn = [16, 1, 73, 1, 200, 1];
  var Wn = [144, 1, 72, 1, 78, 1];
  var Ut = Se.map(qt);
  var Ht = Se.map(Vt);
  Ut.push(64, 2), Ht.push(142, 2);
  var Bt = de.slice(0, -2).map(qt);
  var Ft = de.slice(0, -2).map(Vt);
  Bt.push(...Xn), Ft.push(...Wn);
  var Zt = new g([...Ct, 258, 0, 0]);
  var Pt = new g([...Ct, 3, 0, 0]);
  var Mt = te(Bt);
  var Yt = te(Ft);
  var Xt = new g([...Lt, 0, 0]);
  var Wt = new g([...Lt, 32769, 49153]);
  var Gt = te(Ut);
  var Kt = te(Ht);
  function qt(e, t) {
    return t % 2 ? e : e + 16;
  }
  function Vt(e, t) {
    return t % 2 ? e : e + 128;
  }
  function $t(e, t) {
    let n, r = e._, i = e.next_in_index, f = e.next_out_index, l = e.next_in, _ = e.next_out, o = r.u, a = r.p >>> 0, u = r.T >>> 0, c = r.et, s = r.tt, h = (1 << r.nt) - 1, d = (1 << r.rt) - 1, w = r.h >>> 0, b = r.m >>> 0, k2 = r.v >>> 0, g2 = r.it, m = f - (t - e.avail_out), v = f + (e.avail_out - 257), p2 = i + (e.avail_in - 5), x = 0, T9 = 0, y = 0, I2 = 0;
    e: do {
      for (; u < 15; ) {
        if (!(i < l.length)) break e;
        a += l[i++] << u, u += 8;
      }
      n = c[a & h];
      t: for (; ; ) {
        if (y = n >>> 16 & 255, a >>>= y, u -= y, y = n >>> 24, 0 == y) {
          _[f++] = 65535 & n;
          break;
        }
        if (16 & y) {
          if (x = 65535 & n, y &= 15, y) {
            for (; u < y; ) {
              if (!(i < l.length)) {
                r.ft = 16200;
                break e;
              }
              a += l[i++] << u, u += 8;
            }
            x += a & (1 << y) - 1, a >>>= y, u -= y;
          }
          for (; u < 15; ) {
            if (!(i < l.length)) {
              r.ft = 16200;
              break e;
            }
            a += l[i++] << u, u += 8;
          }
          n = s[a & d];
          n: for (; ; ) {
            if (y = n >>> 16 & 255, a >>>= y, u -= y, y = n >>> 24, 16 & y) {
              if (T9 = 65535 & n, y &= 15, y) {
                for (; u < y; ) {
                  if (!(i < l.length)) {
                    r.ft = 16200;
                    break e;
                  }
                  a += l[i++] << u, u += 8;
                }
                T9 += a & (1 << y) - 1, a >>>= y, u -= y;
              }
              let t2 = x, c2 = f - m;
              if (T9 > c2) {
                let n2 = T9 - c2;
                if (n2 > b && g2) {
                  e.msg = "invalid distance too far back", r.ft = 16209;
                  break e;
                }
                if (0 == k2) {
                  if (I2 = w - n2, !(n2 < t2)) {
                    for (let e2 = 0; e2 < t2; ++e2) _[f++] = o[I2++];
                    continue e;
                  }
                  for (let e2 = 0; e2 < n2; ++e2) _[f++] = o[I2++];
                  t2 -= n2, I2 = f - T9;
                } else if (k2 < n2) {
                  I2 = w + k2 - n2;
                  let e2 = n2 - k2;
                  if (!(e2 < t2)) {
                    for (let e3 = 0; e3 < t2; ++e3) _[f++] = o[I2++];
                    continue e;
                  }
                  for (let t3 = 0; t3 < e2; ++t3) _[f++] = o[I2++];
                  if (t2 -= e2, I2 = 0, !(k2 < t2)) {
                    for (let e3 = 0; e3 < t2; ++e3) _[f++] = o[I2++];
                    continue e;
                  }
                  for (let e3 = 0; e3 < k2; ++e3) _[f++] = o[I2++];
                  t2 -= k2, I2 = f - T9;
                } else {
                  if (I2 = k2 - n2, !(n2 < t2)) {
                    for (let e2 = 0; e2 < t2; ++e2) _[f++] = o[I2++];
                    continue e;
                  }
                  for (let e2 = 0; e2 < n2; ++e2) _[f++] = o[I2++];
                  t2 -= n2, I2 = f - T9;
                }
                for (; t2 > 2; ) _[f++] = _[I2++], _[f++] = _[I2++], _[f++] = _[I2++], t2 -= 3;
                t2 && (_[f++] = _[I2++], t2 > 1 && (_[f++] = _[I2++]));
              } else {
                for (I2 = f - T9; t2 > 2; ) _[f++] = _[I2++], _[f++] = _[I2++], _[f++] = _[I2++], t2 -= 3;
                t2 && (_[f++] = _[I2++], t2 > 1 && (_[f++] = _[I2++]));
              }
              break;
            }
            if (64 & y) {
              e.msg = "invalid distance code", r.ft = 16209;
              break e;
            }
            n = s[(65535 & n) + (a & (1 << y) - 1)];
            continue n;
          }
          break;
        }
        if (64 & y) {
          if (32 & y) {
            r.ft = 16191;
            break e;
          }
          e.msg = "invalid literal/length code", r.ft = 16209;
          break e;
        }
        n = c[(65535 & n) + (a & (1 << y) - 1)];
        continue t;
      }
    } while (i < p2 && f < v);
    let M2 = u >> 3;
    i -= M2, u -= M2 << 3, a &= (1 << u) - 1, e.next_in_index = i, e.next_out_index = f, e.avail_in = i < p2 ? p2 - i + 5 : 5 - (i - p2), e.avail_out = f < v ? v - f + 257 : 257 - (f - v), r.p = a >>> 0, r.T = u >>> 0;
  }
  var Gn = new R(0);
  function M_(e, t) {
    let n = Gn, r = t ? ue + m_ : ue + d_;
    return { ...$e(e, 0), o: e, ft: 16180, lt: false, P: 0, _t: false, ot: 0, ut: 0, ct: 0, st: 0, u: Z, ht: 0, dt: 0, Ge: 0, et: n, tt: n, nt: 0, rt: 0, wt: 0, bt: 0, kt: 0, gt: 0, vt: n, xt: new g(320), Tt: new g(288), yt: new R(r), It: 0, it: true, Mt: 0, zt: 0, Ct: t };
  }
  function We(e, t, n) {
    return e << 24 | t << 16 | n;
  }
  function b_(e = 0, t = 0, n = 0) {
    return We(e, t, n);
  }
  function s_(e = 1) {
    return We(64, e, 0);
  }
  function Jt(e = 0) {
    return We(96, e, 0);
  }
  function Y_(e) {
    return ((255 & e) << 24 | (e >> 8 & 255) << 16 | (e >> 16 & 255) << 8 | e >> 24 & 255) >>> 0;
  }
  var Oe = 15;
  var qn = { Ct: false, Zt, Wt: Mt, qt: Xt, Ot: Gt, St: 20, Dt: 257, jt: 0, At: d_, Qt: false, Nt: true };
  var Vn = { Ct: true, Zt: Pt, Wt: Yt, qt: Wt, Ot: Kt, St: 19, Dt: 256, jt: -1, At: m_, Qt: true, Nt: false };
  function Le(e, t, n, r, i, f, l, _) {
    let o, a, u, c, s, h, d, w, b, k2, m, v, p2, x, T9, y, I2, M2, z2, C2 = new g(Oe + 1), Z2 = new g(Oe + 1), W2 = _ ? Vn : qn;
    for (o = 0; o <= Oe; o++) C2[o] = 0;
    for (a = 0; a < n; a++) C2[t[a]]++;
    for (s = i.Rt, c = Oe; c >= 1 && 0 == C2[c]; c--) ;
    if (s > c && (s = c), 0 == c) return W2.Nt ? (T9 = s_(1), r.Rt[0] = T9, r.Rt[1] = T9, i.Rt = 1, 0) : -1;
    for (u = 1; u < c && 0 == C2[u]; u++) ;
    for (s < u && (s = u), w = 1, o = 1; o <= Oe; o++) if (w <<= 1, w -= C2[o], w < 0) return -1;
    if (w > 0 && (0 == e || 1 != c)) return -1;
    for (Z2[1] = 0, o = 1; o < Oe; o++) Z2[o + 1] = Z2[o] + C2[o];
    for (a = 0; a < n; a++) 0 != t[a] && (f[Z2[t[a]]++] = a);
    switch (e) {
      case 0:
        I2 = M2 = f, z2 = W2.St;
        break;
      case 1:
        I2 = W2.Zt, M2 = W2.Wt, z2 = W2.Dt;
        break;
      default:
        I2 = W2.qt, M2 = W2.Ot, z2 = W2.jt;
    }
    if (k2 = 0, a = 0, o = u, y = l.Rt, h = s, d = 0, p2 = -1, b = 1 << s, x = b - 1, 1 == e && (W2.Qt ? b >= ue : b > ue) || 2 == e && (W2.Qt ? b >= W2.At : b > W2.At)) return 1;
    for (; ; ) {
      T9 = jn(f, a, o, d, e, I2, M2, z2, W2.Ct), m = 1 << o - d, v = 1 << h, u = v;
      do {
        v -= m;
        let e2 = (k2 >> d) + v;
        r.Rt[y + e2] = T9;
      } while (0 != v);
      for (m = 1 << o - 1; k2 & m; ) m >>= 1;
      if (0 != m ? (k2 &= m - 1, k2 += m) : k2 = 0, a++, 0 == --C2[o]) {
        if (o == c) break;
        o = t[f[a]];
      }
      if (o > s && (k2 & x) != p2) {
        for (0 == d && (d = s), y += 1 << h, h = o - d, w = 1 << h; h + d < c && (w -= C2[h + d], !(w <= 0)); ) h++, w <<= 1;
        if (b += 1 << h, 1 == e && (W2.Qt ? b >= ue : b > ue) || 2 == e && (W2.Qt ? b >= W2.At : b > W2.At)) return 1;
        p2 = k2 & x, r.Rt[l.Rt + p2] = We(h, s, y - l.Rt);
      }
    }
    if (0 != k2) for (T9 = s_(o - d); 0 != k2; ) {
      for (0 != d && (k2 & x) != p2 && (d = 0, o = s, y = l.Rt, h = s, T9 = s_(o)), r.Rt[y + (k2 >> d)] = T9, m = 1 << o - 1; k2 & m; ) m >>= 1;
      0 != m ? (k2 &= m - 1, k2 += m) : k2 = 0;
    }
    return l.Rt += b, i.Rt = s, 0;
  }
  function jn(e, t, n, r, i, f, l, _, o) {
    let a;
    if (o ? e[t] < _ : e[t] + 1 < _) a = b_(0, n - r, e[t]);
    else if (o ? e[t] > _ : e[t] >= _) if (o && 1 == i) {
      let i2 = e[t] - 257;
      a = b_(l[i2], n - r, f[i2]);
    } else {
      let i2 = o ? e[t] : e[t] - _;
      a = b_(l[i2], n - r, f[i2]);
    }
    else a = Jt(n - r);
    return a;
  }
  var p_ = new R(0);
  var er = { Ht: true, Jt: new R(544), Ut: p_, Et: p_ };
  var _r = { Ht: true, Jt: new R(544), Ut: p_, Et: p_ };
  function Qt() {
    let e = je();
    return e._ = M_(e, false), e;
  }
  function Ge(e) {
    let t;
    return !(e && (t = e._, !(!t || t.o != e || t.Ct && (t.ft < 16191 || t.ft > 16209) || !t.Ct && (t.ft < 16180 || t.ft > 16211))));
  }
  function tr(e) {
    let t;
    return Ge(e) ? -2 : (t = e._, e.total_in = e.total_out = t.st = 0, e.msg = "", t.P && (e.i = 1 & t.P), t.ft = t.Ct ? 16191 : 16180, t.lt = false, t._t = false, t.ot = -1, t.ut = t.Ct ? 65536 : 32768, delete t.B, t.p = 0, t.T = 0, t.et = t.yt, t.tt = t.yt, t.vt = t.yt, t.it = true, t.Mt = -1, 0);
  }
  function nr(e) {
    let t;
    return Ge(e) ? -2 : (t = e._, t.h = 0, t.m = 0, t.v = 0, tr(e));
  }
  function rr(e, t) {
    let n, r;
    if (Ge(e)) return -2;
    if (r = e._, t < 0) {
      if (t < -16) return -2;
      n = 0, r.Ct = -16 == t, t = -t;
    } else n = 5 + (t >> 4), r.Ct = false, t < 48 && (t &= 15);
    let i = r.Ct ? 16 : 15;
    return t && (t < 8 || t > i) ? -2 : (r.u.length > 0 && r.k != t && (r.u = Z), r.P = n, r.k = t, nr(e));
  }
  function en(e, t) {
    let n, r;
    if (!e) return -2;
    e.msg = "";
    let i = -16 == t;
    return r = M_(e, i), e._ = r, r.o = e, r.ft = i ? 16191 : 16180, n = rr(e, t), n;
  }
  function ar(e) {
    let t = e.Ct ? _r : er, n = { Rt: 0 };
    if (t.Ht) {
      let r, i, f;
      for (r = 0; r < 144; ) e.xt[r++] = 8;
      for (; r < 256; ) e.xt[r++] = 9;
      for (; r < 280; ) e.xt[r++] = 7;
      for (; r < 288; ) e.xt[r++] = 8;
      t.Jt.fill(0), f = t.Jt, t.Ut = f, i = 9;
      let l = { Rt: f }, _ = { Rt: i }, o = { Rt: 0 };
      for (Le(1, e.xt, 288, l, _, e.Tt, o, e.Ct), f = l.Rt, i = _.Rt, e.It = o.Rt, r = 0; r < 32; ) e.xt[r++] = 5;
      i = 5;
      let a = o.Rt, u = { Rt: f }, c = { Rt: i };
      n.Rt = a, Le(2, e.xt, 32, u, c, e.Tt, n, e.Ct), t.Et = f.slice(a), t.Ht = false;
    }
    e.et = t.Ut, e.nt = 9, e.tt = t.Et, e.rt = 5, e.It = n.Rt;
  }
  function ir(e, t, n) {
    let r = e._;
    if (!(r.u && 0 != r.u.length || (r.u = new p(1 << r.k), r.u))) return 1;
    if (0 == r.h && (r.h = 1 << r.k, r.v = 0, r.m = 0), n >= r.h) M(r.u, 0, t, t.length - r.h, r.h), r.v = 0, r.m = r.h;
    else {
      let e2 = r.h - r.v;
      e2 > n && (e2 = n), M(r.u, r.v, t, t.length - n, e2), (n -= e2) ? (M(r.u, 0, t, t.length - n, n), r.v = n, r.m = r.h) : (r.v += e2, r.v == r.h && (r.v = 0), r.m < r.h && (r.m += e2));
    }
    return 0;
  }
  var S_ = class extends z {
    constructor() {
      super("Need more input");
    }
  };
  function _n(e, t) {
    let n, r, i, f, l, _, o, a, u, c, s, h, d, w, b, k2, g2, m = new p(4);
    if (Ge(e) || !e.next_out || !e.next_in && 0 != e.avail_in) return -2;
    _ = 0, a = 0, o = 0, u = 0, r = Z, i = 0, f = Z, l = 0, n = e._, 16191 == n.ft && (n.ft = 16192), I2(), c = _, s = o, g2 = 0;
    try {
      for (; ; ) switch (n.ft) {
        case 16180:
          if (0 == n.P) {
            n.ft = 16192;
            break;
          }
          if (O2(16), 2 & n.P && 35615 == a) {
            0 == n.k && (n.k = 15), n.ct = W(0), n.ct = T9(n.ct, a), C2(), n.ft = 16181;
            break;
          }
          if (n.B && (n.B.Yt = -1), !(1 & n.P) || ((S(8) << 8) + (a >> 8)) % 31) {
            e.msg = "incorrect header check", n.ft = 16209;
            break;
          }
          if (8 != S(4)) {
            e.msg = "unknown compression method", n.ft = 16209;
            break;
          }
          if (D(4), k2 = S(4) + 8, 0 == n.k && (n.k = k2), k2 > 15 || k2 > n.k) {
            e.msg = "invalid window size", n.ft = 16209;
            break;
          }
          n.ut = 1 << k2, n.ot = 0, e.i = n.ct = se(0), n.ft = 512 & a ? 16189 : 16191, C2();
          break;
        case 16181:
          if (O2(16), n.ot = a, 8 != (255 & n.ot)) {
            e.msg = "unknown compression method", n.ft = 16209;
            break;
          }
          if (57344 & n.ot) {
            e.msg = "unknown header flags set", n.ft = 16209;
            break;
          }
          n.B && (n.B.Fe = a >> 8 & 1), 512 & n.ot && 4 & n.P && (n.ct = T9(n.ct, a)), C2(), n.ft = 16182;
        case 16182:
          O2(32), n.B && (n.B.Xe = a), 512 & n.ot && 4 & n.P && (n.ct = y(n.ct, a)), C2(), n.ft = 16183;
        case 16183:
          O2(16), n.B && (n.B.Pt = 255 & a, n.B.$e = a >> 8), 512 & n.ot && 4 & n.P && (n.ct = T9(n.ct, a)), C2(), n.ft = 16184;
        case 16184:
          1024 & n.ot ? (O2(16), n.ht = a, n.B && (n.B.Ke = a), 512 & n.ot && 4 & n.P && (n.ct = T9(n.ct, a)), C2()) : n.B && (n.B.Ge = Z), n.ft = 16185;
        case 16185:
          if (1024 & n.ot && (h = n.ht, h > _ && (h = _), h && (n.B && n.B.Ge && n.B.Bt && (k2 = n.B.Ke - n.ht) < n.B.Bt && M(n.B.Ge, k2, r, i, h), 512 & n.ot && 4 & n.P && (n.ct = W(n.ct, r.subarray(i, i + h), h)), _ -= h, i += h, n.ht -= h), n.ht)) return v();
          n.ht = 0, n.ft = 16186;
        case 16186:
          if (2048 & n.ot) {
            if (0 == _) return v();
            h = 0;
            do {
              k2 = r[i + h++], n.B && n.B.Ft && n.ht < n.B.Ft && (n.B.Ve[n.ht++] = k2);
            } while (k2 && h < _);
            if (512 & n.ot && 4 & n.P && (n.ct = W(n.ct, r.subarray(i, i + h), h)), _ -= h, i += h, k2) return v();
          } else n.B && (n.B.Ve = Z);
          n.ht = 0, n.ft = 16187;
        case 16187:
          if (4096 & n.ot) {
            if (0 == _) return v();
            h = 0;
            do {
              k2 = r[i + h++], n.B && n.B.Gt && n.ht < n.B.Gt && (n.B.Le[n.ht++] = k2);
            } while (k2 && h < _);
            if (512 & n.ot && 4 & n.P && (n.ct = W(n.ct, r.subarray(i, i + h), h)), _ -= h, i += h, k2) return v();
          } else n.B && (n.B.Le = Z);
          n.ft = 16188;
        case 16188:
          if (512 & n.ot) {
            if (O2(16), 4 & n.P && a != (65535 & n.ct)) {
              e.msg = "header crc mismatch", n.ft = 16209;
              break;
            }
            C2();
          }
          n.B && (n.B.Be = n.ot >> 9 & 1, n.B.Yt = 1), e.i = n.ct = W(0), n.ft = 16191;
          break;
        case 16189:
          O2(32), e.i = n.ct = Y_(a), C2(), n.ft = 16190;
        case 16190:
          if (!n._t) return z2(), 2;
          e.i = n.ct = se(0), n.ft = 16191;
        case 16191:
          if (5 == t || 6 == t) return v();
        case 16192:
          if (n.lt) {
            j2(), n.ft = 16206;
            break;
          }
          switch (O2(3), n.lt = !!S(1), D(1), S(2)) {
            case 0:
              n.ft = 16193;
              break;
            case 1:
              if (ar(n), n.ft = 16199, 6 == t) return D(2), v();
              break;
            case 2:
              n.ft = 16196;
              break;
            case 3:
              e.msg = "invalid block type", n.ft = 16209;
          }
          D(2);
          break;
        case 16193:
          if (j2(), O2(32), (65535 & a) != (a >>> 16 ^ 65535)) {
            e.msg = "invalid stored block lengths", n.ft = 16209;
            break;
          }
          if (n.ht = 65535 & a, C2(), n.ft = 16194, 6 == t) return v();
        case 16194:
          n.ft = 16195;
        case 16195:
          if (h = n.ht, h) {
            if (h > _ && (h = _), h > o && (h = o), 0 == h) return v();
            M(f, l, r, i, h), _ -= h, i += h, o -= h, l += h, n.ht -= h;
            break;
          }
          n.ft = 16191;
          break;
        case 16196:
          if (O2(14), n.bt = S(5) + 257, D(5), n.kt = S(5) + 1, D(5), n.wt = S(4) + 4, D(4), n.bt > 286 || !n.Ct && n.kt > 30) {
            e.msg = n.Ct ? "too many length" : "too many length or distance symbols", n.ft = 16209;
            break;
          }
          n.gt = 0, n.ft = 16197;
        case 16197:
          for (; n.gt < n.wt; ) O2(3), n.xt[pe[n.gt++]] = S(3), D(3);
          for (; n.gt < 19; ) n.xt[pe[n.gt++]] = 0;
          n.vt = n.yt, n.et = n.tt = n.vt, n.nt = 7;
          let c2 = { Rt: n.vt }, m2 = { Rt: n.nt }, p2 = { Rt: 0 };
          if (g2 = Le(0, n.xt, 19, c2, m2, n.Tt, p2, n.Ct), n.vt = c2.Rt, n.nt = m2.Rt, g2) {
            e.msg = "invalid code lengths set", n.ft = 16209;
            break;
          }
          n.gt = 0, n.ft = 16198;
        case 16198:
          for (; n.gt < n.bt + n.kt; ) {
            for (; w = n.et[S(n.nt)], !((w >>> 16 & 255) <= u); ) q2();
            if ((65535 & w) < 16) D(w >>> 16 & 255), n.xt[n.gt++] = 65535 & w;
            else {
              if (16 == (65535 & w)) {
                if (O2(2 + (w >>> 16 & 255)), D(w >>> 16 & 255), 0 == n.gt) {
                  e.msg = "invalid bit length repeat", n.ft = 16209;
                  break;
                }
                k2 = n.xt[n.gt - 1], h = 3 + S(2), D(2);
              } else 17 == (65535 & w) ? (O2(3 + (w >>> 16 & 255)), D(w >>> 16 & 255), k2 = 0, h = 3 + S(3), D(3)) : (O2(7 + (w >>> 16 & 255)), D(w >>> 16 & 255), k2 = 0, h = 11 + S(7), D(7));
              if (n.gt + h > n.bt + n.kt) {
                e.msg = "invalid bit length repeat", n.ft = 16209;
                break;
              }
              for (; h--; ) n.xt[n.gt++] = k2;
            }
          }
          if (16209 == n.ft) break;
          if (0 == n.xt[256]) {
            e.msg = "invalid code -- missing end-of-block", n.ft = 16209;
            break;
          }
          n.vt = n.yt, n.nt = 9;
          let A = { Rt: n.vt }, Q2 = { Rt: n.nt }, N = { Rt: 0 };
          g2 = Le(1, n.xt, n.bt, A, Q2, n.Tt, N, n.Ct), n.vt = A.Rt, n.nt = Q2.Rt;
          let R2 = N.Rt;
          if (n.et = n.vt.slice(0, R2), g2) {
            e.msg = "invalid literal/lengths set", n.ft = 16209;
            break;
          }
          n.rt = 6;
          let H2 = n.xt.subarray(n.bt, n.bt + n.kt), J2 = { Rt: n.vt }, U = { Rt: n.rt }, E = { Rt: R2 };
          if (g2 = Le(2, H2, n.kt, J2, U, n.Tt, E, n.Ct), n.vt = J2.Rt, n.rt = U.Rt, n.tt = n.vt.slice(R2), g2) {
            e.msg = "invalid distances set", n.ft = 16209;
            break;
          }
          if (n.ft = 16199, 6 == t) return v();
        case 16199:
          n.ft = 16200;
        case 16200:
          if (!n.Ct && _ >= 6 && o >= 258) {
            z2(), $t(e, s), I2(), 16191 == n.ft && (n.Mt = -1);
            break;
          }
          for (n.Mt = 0; w = n.et[S(n.nt)], !((w >>> 16 & 255) <= u); ) q2();
          if (w >>> 24 && !(w >>> 24 & 240)) {
            for (b = w; w = n.et[(65535 & b) + (S((b >>> 16 & 255) + (b >>> 24)) >> (b >>> 16 & 255))], !((b >>> 16 & 255) + (w >>> 16 & 255) <= u); ) q2();
            D(b >>> 16 & 255), n.Mt += b >>> 16 & 255;
          }
          if (D(w >>> 16 & 255), n.Mt += w >>> 16 & 255, n.ht = 65535 & w, !(w >>> 24)) {
            n.ft = 16205;
            break;
          }
          if (w >>> 24 & 32) {
            n.Mt = -1, n.ft = 16191;
            break;
          }
          if (w >>> 24 & 64) {
            e.msg = "invalid literal/length code", n.ft = 16209;
            break;
          }
          n.Ge = w >>> 24 & (n.Ct ? 31 : 15), n.ft = 16201;
        case 16201:
          n.Ge && (O2(n.Ge), n.ht += S(n.Ge), D(n.Ge), n.Mt += n.Ge), n.zt = n.ht, n.ft = 16202;
        case 16202:
          for (; w = n.tt[S(n.rt)], !((w >>> 16 & 255) <= u); ) q2();
          if (!(w >>> 24 & 240)) {
            for (b = w; w = n.tt[(65535 & b) + (S((b >>> 16 & 255) + (b >>> 24)) >> (b >>> 16 & 255))], !((b >>> 16 & 255) + (w >>> 16 & 255) <= u); ) q2();
            D(b >>> 16 & 255), n.Mt += b >>> 16 & 255;
          }
          if (D(w >>> 16 & 255), n.Mt += w >>> 16 & 255, w >>> 24 & 64) {
            e.msg = "invalid distance code", n.ft = 16209;
            break;
          }
          n.dt = 65535 & w, n.Ge = w >>> 24 & 15, n.ft = 16203;
        case 16203:
          n.Ge && (O2(n.Ge), n.dt += S(n.Ge), D(n.Ge), n.Mt += n.Ge), n.ft = 16204;
        case 16204:
          if (0 == o) return v();
          if (h = s - o, n.dt > h) {
            if (h = n.dt - h, h > n.m && n.it) {
              e.msg = "invalid distance too far back", n.ft = 16209;
              break;
            }
            h > n.v ? (h -= n.v, d = n.h - h) : d = n.v - h, h > n.ht && (h = n.ht), h > o && (h = o);
            for (let e2 = 0; e2 < h; ++e2) f[l] = 255 & n.u[d], ++l, ++d;
          } else {
            d = l - n.dt, h = n.ht, h > o && (h = o);
            for (let e2 = 0; e2 < h; ++e2) f[l] = f[d], ++l, ++d;
          }
          h > o && (h = o), o -= h, n.ht -= h, 0 == n.ht && (n.ft = 16200);
          break;
        case 16205:
          if (0 == o) return v();
          f[l++] = n.ht, o--, n.ft = 16200;
          break;
        case 16206:
          if (n.P) {
            if (O2(32), s -= o, e.total_out += s, n.st += s, 4 & n.P && s) {
              let t2 = f.subarray(l - s, l);
              e.i = n.ct = x(n.ct, t2, s);
            }
            if (s = o, 4 & n.P && (n.ot ? a : Y_(a) >>> 0) != n.ct) {
              e.msg = "incorrect data check", n.ft = 16209;
              break;
            }
            C2();
          }
          n.ft = 16207;
        case 16207:
          if (n.P && n.ot) {
            if (O2(32), 4 & n.P && a != (4294967295 & n.st)) {
              e.msg = "incorrect length check", n.ft = 16209;
              break;
            }
            C2();
          }
          n.ft = 16208;
        case 16208:
          return g2 = 1, v();
        case 16209:
          return g2 = -3, v();
        case 16210:
          return -4;
        default:
          return -2;
      }
    } catch (e2) {
      if (e2 instanceof S_) return v();
      throw e2;
    }
    function v() {
      if (z2(), n.h || s != e.avail_out && n.ft < 16209 && ((n.Ct ? n.ft < 16208 : n.ft < 16206) || 4 != t)) {
        let t2 = s - e.avail_out;
        if (ir(e, e.next_out.subarray(e.next_out_index - t2, e.next_out_index), t2)) return n.ft = 16210, -4;
      }
      return c -= e.avail_in, s -= e.avail_out, e.total_in += c, e.total_out += s, n.st += s, 4 & n.P && s && (e.i = n.ct = x(n.ct, e.next_out.subarray(e.next_out_index - s, e.next_out_index), s)), e.t = n.T + (n.lt ? 64 : 0) + (16191 == n.ft ? 128 : 0) + (16199 == n.ft || 16194 == n.ft ? 256 : 0), (0 == c && 0 == s && 0 == g2 || 4 == t && 0 == g2) && (g2 = -5), g2;
    }
    function x(e2, t2, r2) {
      return n.ot ? W(e2, t2, r2) : se(e2, t2, r2);
    }
    function T9(e2, t2) {
      return m[0] = 255 & t2, m[1] = t2 >>> 8 & 255, W(e2, m, 2) >>> 0;
    }
    function y(e2, t2) {
      return m[0] = 255 & t2, m[1] = t2 >>> 8 & 255, m[2] = t2 >>> 16 & 255, m[3] = t2 >>> 24 & 255, W(e2, m, 4) >>> 0;
    }
    function I2() {
      f = e.next_out, l = e.next_out_index, o = e.avail_out, r = e.next_in, i = e.next_in_index, _ = e.avail_in, a = n.p, u = n.T;
    }
    function z2() {
      e.next_out = f, e.next_out_index = l, e.avail_out = o, e.next_in = r, e.next_in_index = i, e.avail_in = _, n.p = a, n.T = u;
    }
    function C2() {
      a = 0, u = 0;
    }
    function q2() {
      if (0 == _) throw new S_();
      _--, a += (255 & r[i]) << u, i++, a >>>= 0, u += 8;
    }
    function O2(e2) {
      for (; u < e2; ) q2();
    }
    function S(e2) {
      return a & (1 << e2) - 1;
    }
    function D(e2) {
      a >>>= e2, u -= e2;
    }
    function j2() {
      a >>>= 7 & u, u -= 7 & u;
    }
  }
  function tn(e) {
    return Ge(e) ? -2 : 0;
  }
  var X_ = 65536;
  var or = 32768;
  var nn = "trailing data after the end of the stream";
  var W_ = class {
    constructor(e = 16, t = X_) {
      this.Vt = [], this.Lt = e;
      for (let n = 0; n < O.min(e, 4); n++) this.Vt.push(new p(t));
    }
    acquire(e = X_) {
      for (let t = this.Vt.length - 1; t >= 0; t--) {
        let n = this.Vt[t];
        if (n.length >= e) return this.Vt.splice(t, 1), n;
      }
      return new p(e);
    }
    release(e) {
      this.Vt.length < this.Lt && this.Vt.push(e);
    }
  };
  function rn(e) {
    let t = new W_(32, X_), n = null;
    function r() {
      let t2 = e.Xt(), n2 = e.$t(t2);
      if (0 != n2 && 0 != n2) throw new z("init failed: " + n2);
      return { o: t2 };
    }
    function i(e2) {
      try {
        t.release(e2);
      } catch {
      }
    }
    return new H({ start() {
    }, transform(f, l) {
      n || (n = r());
      let _ = n.o;
      if (n.Kt) {
        if (f.length) throw new z(nn);
        return;
      }
      let o = 0;
      for (; o < f.length; ) {
        let r2 = O.min(f.length - o, or), a = f.subarray(o, o + r2);
        for (_.next_in = a, _.next_in_index = 0, _.avail_in = a.length; _.avail_in > 0; ) {
          let r3 = t.acquire(), f2 = false;
          try {
            _.next_out = r3, _.next_out_index = 0, _.avail_out = r3.length;
            let i2 = e.en(_, 0), o2 = r3.length - _.avail_out;
            if (o2 > 0) {
              let e2 = false, n2 = { tn: r3.subarray(0, o2), release: () => {
                e2 || (e2 = true, t.release(r3));
              } };
              f2 = true, l.enqueue(n2);
            }
            if (1 == i2) {
              n.Kt = true;
              break;
            }
            if (0 != i2) throw new z("process error: " + i2);
          } finally {
            f2 || i(r3);
          }
        }
        if (n.Kt) {
          if (_.avail_in > 0 || o + r2 < f.length) throw new z(nn);
          break;
        }
        o += r2;
      }
    }, flush(f) {
      if (n && n.Kt) return;
      n || (n = r());
      let l = n.o;
      for (; ; ) {
        let n2 = t.acquire(), r2 = false;
        try {
          l.next_out = n2, l.next_out_index = 0, l.avail_out = n2.length;
          let i2 = e.en(l, 4), _2 = n2.length - l.avail_out;
          if (_2 > 0) {
            let e2 = false, i3 = { tn: n2.subarray(0, _2), release: () => {
              e2 || (e2 = true, t.release(n2));
            } };
            r2 = true, f.enqueue(i3);
          }
          if (1 == i2) break;
          if (0 != i2) throw new z("finalization error: " + i2);
        } finally {
          r2 || i(n2);
        }
      }
      let _ = e.nn(l);
      if (0 != _ && 0 != _) throw new z("end failed: " + _);
    } });
  }
  function an() {
    return new H({ start() {
    }, transform(e, t) {
      try {
        t.enqueue(e.tn.slice(0));
      } finally {
        e.release();
      }
    }, flush() {
    } });
  }
  var fr = /* @__PURE__ */ new Map([["deflate", 15], ["gzip", 31], ["deflate-raw", -15]]);
  var lr = /* @__PURE__ */ new Map([["deflate", 15], ["gzip", 31], ["deflate-raw", -15], ["deflate64-raw", -16]]);
  function on(e, t) {
    let n = e.get(t);
    if (void 0 === n) throw new TypeError(`Unsupported format: ${t}`);
    return n;
  }
  function ur(e = "deflate", t) {
    let n = on(fr, e), r = t && "number" == typeof t.level ? t.level : -1;
    return rn({ Xt: () => vt(), $t: (e2) => kt(e2, r, 8, n, 8, 0), en: Nt, nn: P_ });
  }
  function cr(e = "deflate") {
    let t = on(lr, e);
    return rn({ Xt: () => Qt(), $t: (e2) => en(e2, t), en: _n, nn: tn });
  }
  var E_ = class {
    constructor(e = "deflate", t) {
      let n = ur(e, t);
      this.writable = n.writable, this.readable = n.readable.pipeThrough(an());
    }
  };
  var g_ = class {
    constructor(e = "deflate") {
      let t = cr(e);
      this.writable = t.writable, this.readable = t.readable.pipeThrough(an());
    }
  };

  // ../../node_modules/@zip.js/zip.js/lib/zip-module-native.js
  init_codec_pool();
  setDefaultConfiguration({
    workerURI: "./core/web-worker-native.js",
    wasmURI: null,
    CompressionStreamFallback: E_,
    DecompressionStreamFallback: g_
  });

  // src/ugoira-player.ts
  function calculateDecodeSize(width, height, maxPixels) {
    if (width * height <= maxPixels) return { width, height };
    const scale = Math.sqrt(maxPixels / (width * height));
    return {
      width: Math.max(1, Math.floor(width * scale)),
      height: Math.max(1, Math.floor(height * scale))
    };
  }
  var UgoiraPlayer = class {
    options;
    currentFrame;
    currentIndex = 0;
    pendingFrame;
    scheduleHandle;
    disposed = false;
    constructor(options) {
      this.options = options;
    }
    async start() {
      if (this.disposed || this.currentFrame) return;
      const frame = await this.options.loadFrame(0);
      if (this.disposed) {
        frame.close();
        return;
      }
      this.showFrame({ index: 0, frame });
    }
    dispose() {
      if (this.disposed) return;
      this.disposed = true;
      if (this.scheduleHandle !== void 0) {
        this.options.cancelSchedule(this.scheduleHandle);
        this.scheduleHandle = void 0;
      }
      this.currentFrame?.close();
      this.currentFrame = void 0;
      const pending = this.pendingFrame;
      this.pendingFrame = void 0;
      void pending?.then(({ frame }) => frame.close(), () => void 0);
    }
    advance = () => {
      if (this.disposed || !this.pendingFrame) return;
      const pending = this.pendingFrame;
      void pending.then(
        (next) => {
          if (this.pendingFrame === pending) this.pendingFrame = void 0;
          if (!this.disposed) this.showFrame(next);
        },
        (error) => {
          if (this.pendingFrame === pending) this.pendingFrame = void 0;
          if (!this.disposed) {
            this.dispose();
            this.options.onError(error);
          }
        }
      );
    };
    showFrame(next) {
      this.options.drawFrame(next.frame);
      this.currentFrame?.close();
      this.currentFrame = next.frame;
      this.currentIndex = next.index;
      if (this.options.frameCount <= 1) return;
      this.prepareNextFrame();
      this.scheduleHandle = this.options.schedule(
        this.advance,
        Math.max(1, this.options.getDelay(next.index))
      );
    }
    prepareNextFrame() {
      const index = (this.currentIndex + 1) % this.options.frameCount;
      const pending = this.options.loadFrame(index).then((frame) => ({ index, frame }));
      this.pendingFrame = pending;
      void pending.catch(() => void 0);
    }
  };

  // src/ugoira-renderer.ts
  var MAX_ARCHIVE_BYTES = 96 * 1024 * 1024;
  var MAX_FRAME_BYTES = 32 * 1024 * 1024;
  var MAX_DECODE_PIXELS = 2e6;
  var UgoiraArtworkRenderer = class {
    constructor(api, settings) {
      this.api = api;
      this.settings = settings;
    }
    async load(artwork, _index, signal, onProgress) {
      const metadata = await this.api.getUgoiraMetadata(artwork.id, signal);
      this.validateMetadata(metadata);
      const url = this.settings.value.imageQuality === "original" ? metadata.originalSrc : metadata.src;
      const archive = await this.download(url, signal, onProgress);
      signal.throwIfAborted();
      const reader = new ZipReader(new BlobReader(archive), {
        useCompressionStream: true,
        useWebWorkers: false
      });
      const lifetime = new AbortController();
      const abort2 = () => lifetime.abort(signal.reason);
      signal.addEventListener("abort", abort2, { once: true });
      let readerClosed = false;
      const closeReader = (reason) => {
        if (readerClosed) return;
        readerClosed = true;
        signal.removeEventListener("abort", abort2);
        lifetime.abort(reason);
        return reader.close();
      };
      try {
        const entries = await reader.getEntries();
        lifetime.signal.throwIfAborted();
        const files = new Map(
          entries.filter((entry) => !entry.directory).map((entry) => [entry.filename, entry])
        );
        const orderedEntries = metadata.frames.map(({ file }) => {
          const entry = files.get(file);
          if (!entry) throw new Error(`\u52A8\u56FE\u5E27\u4E0D\u5B58\u5728: ${file}`);
          if (entry.uncompressedSize > MAX_FRAME_BYTES) {
            throw new Error(`\u52A8\u56FE\u5355\u5E27\u8D85\u8FC7 ${MAX_FRAME_BYTES} \u5B57\u8282\u9650\u5236`);
          }
          return entry;
        });
        const decodeSize = calculateDecodeSize(
          artwork.width,
          artwork.height,
          MAX_DECODE_PIXELS
        );
        const canvas = document.createElement("canvas");
        canvas.width = decodeSize.width;
        canvas.height = decodeSize.height;
        canvas.setAttribute("aria-label", artwork.title);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 Canvas 2D");
        const player = new UgoiraPlayer({
          frameCount: orderedEntries.length,
          getDelay: (index) => metadata.frames[index].delay,
          loadFrame: async (index) => {
            const blob = await orderedEntries[index].getData(
              new BlobWriter(metadata.mime_type),
              { signal: lifetime.signal, checkCrc32: true }
            );
            lifetime.signal.throwIfAborted();
            const bitmap = await createImageBitmap(blob, {
              resizeWidth: decodeSize.width,
              resizeHeight: decodeSize.height,
              resizeQuality: "high"
            });
            if (lifetime.signal.aborted) {
              bitmap.close();
              lifetime.signal.throwIfAborted();
            }
            return bitmap;
          },
          drawFrame: (frame) => {
            context.drawImage(frame, 0, 0);
          },
          schedule: (callback, delay) => window.setTimeout(callback, delay),
          cancelSchedule: (handle) => window.clearTimeout(handle),
          onError: (error) => {
            void closeReader(error)?.catch(() => void 0);
            console.error("[Pixiv Preview] \u52A8\u56FE\u5E27\u89E3\u7801\u5931\u8D25", error);
          }
        });
        await player.start();
        let disposed = false;
        return {
          element: canvas,
          width: artwork.width,
          height: artwork.height,
          dispose: () => {
            if (disposed) return;
            disposed = true;
            const error = new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError");
            void closeReader(error)?.catch(() => void 0);
            player.dispose();
            canvas.width = 1;
            canvas.height = 1;
          }
        };
      } catch (error) {
        await closeReader(error)?.catch(() => void 0);
        throw error;
      }
    }
    preload() {
      return Promise.resolve();
    }
    cancelPreload() {
    }
    getUrl(artwork) {
      return artwork.urls.regular;
    }
    validateMetadata(metadata) {
      if (metadata.mime_type !== "image/jpeg") {
        throw new Error(`\u4E0D\u652F\u6301\u7684\u52A8\u56FE\u5E27\u683C\u5F0F: ${metadata.mime_type}`);
      }
      if (!metadata.frames.length) throw new Error("\u52A8\u56FE\u6CA1\u6709\u53EF\u64AD\u653E\u5E27");
    }
    download(url, signal, onProgress) {
      return new Promise((resolve, reject) => {
        let request;
        let settled = false;
        const finish = (blob, error) => {
          if (settled) return;
          settled = true;
          signal.removeEventListener("abort", abort2);
          if (error) reject(error);
          else if (blob) resolve(blob);
        };
        const abort2 = () => {
          request?.abort();
          finish(void 0, new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError"));
        };
        const rejectOversized = () => {
          request?.abort();
          finish(void 0, new Error("\u52A8\u56FE\u6587\u4EF6\u8FC7\u5927\uFF0C\u5DF2\u505C\u6B62\u9884\u89C8\u4EE5\u4FDD\u62A4\u9875\u9762"));
        };
        signal.addEventListener("abort", abort2, { once: true });
        request = GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { Referer: "https://www.pixiv.net/" },
          responseType: "blob",
          onprogress: (event) => {
            if (event.loaded > MAX_ARCHIVE_BYTES || event.lengthComputable && event.total > MAX_ARCHIVE_BYTES) {
              rejectOversized();
              return;
            }
            onProgress({
              loaded: event.loaded,
              total: event.lengthComputable ? event.total : void 0
            });
          },
          onload: (response) => {
            if (response.status < 200 || response.status >= 300) {
              finish(
                void 0,
                new Error(
                  `\u52A8\u56FE\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
                )
              );
              return;
            }
            if (response.response.size > MAX_ARCHIVE_BYTES) {
              rejectOversized();
              return;
            }
            onProgress({
              loaded: response.response.size,
              total: response.response.size
            });
            finish(response.response);
          },
          onerror: (response) => finish(
            void 0,
            new Error(
              `\u52A8\u56FE\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
            )
          ),
          onabort: () => finish(void 0, new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError")),
          ontimeout: () => finish(void 0, new Error("\u52A8\u56FE\u8BF7\u6C42\u8D85\u65F6"))
        });
        if (signal.aborted) abort2();
      });
    }
  };

  // src/index.ts
  var SETTINGS_KEY = "pixivPreviewSettings";
  function bootstrap() {
    injectStyle();
    const api = new PixivApi();
    const notification = new Notification();
    const settings = new SettingsStore({
      get: () => GM_getValue(SETTINGS_KEY, DEFAULT_SETTINGS),
      set: (value) => GM_setValue(SETTINGS_KEY, value)
    });
    const bookmarkController = new BookmarkController(api, notification);
    const imageCache = new BrowserImageCache(settings.value.cacheWorks);
    const staticRenderer = new StaticArtworkRenderer(imageCache, settings);
    const renderer = new ArtworkRendererDispatcher(
      staticRenderer,
      new UgoiraArtworkRenderer(api, settings)
    );
    let previousSettings = settings.value;
    settings.subscribe((nextSettings) => {
      imageCache.setMaxWorks(nextSettings.cacheWorks);
      if (nextSettings.imageQuality !== previousSettings.imageQuality) {
        imageCache.clear();
      } else if (!nextSettings.preloadEnabled) {
        imageCache.cancelPreload();
      }
      previousSettings = nextSettings;
    });
    new SettingsPanel(settings, notification);
    new PreviewController(
      api,
      renderer,
      bookmarkController,
      notification,
      settings
    );
  }
  bootstrap();
})();
