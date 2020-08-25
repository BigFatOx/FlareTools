# FlareTools

## Overview

This tool accepts an XRP Address as input and will find all `settings transactions` on the XRP Ledger that contain a MessageKey with a compatible ETH address.

The format of the `MessageKey` is expected to be
`^02[0]{24}[a-fA-F0-9]{40}$`
`02000000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

## CLI Commands

-   `yarn`: Installs dependencies

-   `yarn run dev`: Run a development, HMR server

-   `yarn run serve`: Run a production-like server

-   `yarn run build`: Production-ready build

-   `yarn run lint`: Pass TypeScript files using TSLint

-   `yarn run test`: Run Jest and Enzyme with
    [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for
    your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
