# sfz-web-player
![Release](https://github.com/kmturley/sfz-web-player/workflows/Release/badge.svg)

SFZ player using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), built with:

* NodeJS 16.x
* TypeScript 4.x
* Sass 1.x


## Installation

Install dependencies using:

    npm install


## Usage

Run the development server using:

    npm run dev

Create a build using:

    npm run build


## Deployment

Release an updated version on GitHub by simply creating a version tag:

    npm version patch
    git push && git push origin --tags

This will run an automated build and deploy process on GitHub Actions:

    .github/workflows/release.yml


## Contact

For more information please contact kmturley
