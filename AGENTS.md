# Instructions for Agents: Contributing via command line

## 1. Setup git repo

Check to see if you are inside the registry repository:

```bash
git status
```

If you see an error message like `fatal: not a git repository`, then use GitHub CLI to fork the repository:

```bash
gh repo fork sfzlab/sfz-web-player --clone
cd sfz-web-player
```

Ensure you are on the main branch and up-to-date with changes:

```bash
git checkout main
git pull
npm install
```

Then continue to step 2.

## 2. Learn about the project

Read the existing source code in `./src` to understand the current state of the TypeScript project.

Read the Web Audio API docs in `./docs/web-audio-api` to understand browser support for audio processing.

Read the sfz format documentation in `./docs/sfz-format` to understand the instrument specification to support.

## 3. Contributing changes

Create a new branch for your contribution. Use descriptive branch names following these conventions:

- `feature/feature-name` for new features
- `fix/fix-name` for bug fixes

Edit TypeScript/JavaScript files in the codebase using your tools. Ensure changes follow the project's coding standards, enforced by Prettier (.prettierrc.json) for code formatting, ESLint (eslint.config.js) for linting, and Vitest (vitest.config.ts) for the test suite.

Then proceed to step 4.

## 4. Validate Changes

Run the check command which will run code formatting, linting, tests and build commands to validate the changes:

```bash
npm run check
```

Verify that all tests pass and there are no linting errors.

Return a summary of the changes to the user for them to read/review.

Ask user for [Y/N] approval to proceed to Commit Changes, Push Changes and Submit Pull Request.

- If the user answers Yes or Y, continue to step 4.
- If the user answers No or N, ask them what changes they would like to make, and iterate until they are happy with the result, each time asking for approval before continuing to step 4.

## 5. Commit, push and pr changes

Stage and commit your changes. Use descriptive commit messages with prefixes following these conventions:

- `[feature]` for new features
- `[fix]` for bug fixes

Example:

```bash
git add .
git commit -m "[feature] Feature name. Add descriptive commit message for your changes"
```

Push the branch to your forked repository:

```bash
git push origin feature/your-contribution-name
```

Create a pull request using GitHub CLI:

```bash
gh pr create --title "Your PR Title" --body "Description of your changes"
```

Then proceed to step 5.

## 6. Conclusion

Respond to the user that the contribution has been submitted for review, with the url to the PR for them to view.
