## How to run

- make sure you have node installed; the version it's tested with is `v16.6.2`
- checkout the repo, and run the following commands:

```
npm install
npm run start
```

## Improvements todo 

- some REPL expectations aren't held right now - because yargs lib is used to parse args + generate help and it seems yargs is made for CLI not for REPL
- fix help text removing binary prefix from it
- we could easily make it "multi-storages" app
- validate args
- package it into a binary!
