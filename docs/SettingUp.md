# Setting Up and Getting Started

---

This DuckCode repository contains two independent directories, `client` and `server`, which need to be set up independently.

First, clone the repository into your computer
```sh
git clone https://github.com/Masunori/DuckCode.git
```
---

## Setting up the `client` directory
The `client` is coded using the [Next.js](https://nextjs.org/) framework, so it is a pre-requisite.

After you clone the repository, install all dependencies
```sh
npm install
```

Then, run the development server
```sh
npm run dev
```

Open (http://localhost:3000) with your browser to see the results. You should be redirected to (http://localhost:3000/landing).

**NOTE**: Before you start to edit anything, it is advised to refer to the [Developer Guide](DeveloperGuide.md).

> [!NOTE]
> We will work on using Docker to set up the correct environment in the future.

---

## Setting up the `server` directory

---

## Making changes

First, create your own branch. Then make edits on your own branch. Do not touch the main branch.

Then, make a pull request, which will be reviewed before merging happens. When the PR is approved and your branch is merged, please remember to merge the main branch back to your branch before continuing making changes.
