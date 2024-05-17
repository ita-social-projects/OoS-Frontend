<a href="https://softserve.academy/"><img src="https://s.057.ua/section/newsInternalIcon/upload/images/news/icon/000/050/792/vnutr_5ce4f980ef15f.jpg" title="SoftServe IT Academy" alt="SoftServe IT Academy"></a>

![](/img/logo.png)

# Out of School

> The platform for choosing an extracurricular activity for your children

[![Lint, build and test](https://github.com/ita-social-projects/OoS-Frontend/actions/workflows/tests.yml/badge.svg)](https://github.com/ita-social-projects/OoS-Frontend/actions/workflows/tests.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?branch=develop&project=ita-social-projects-oos-frontend&metric=coverage)](https://sonarcloud.io/dashboard?id=ita-social-projects-oos-frontend&branch=develop)
[![Github Issues](https://img.shields.io/github/issues/ita-social-projects/OoS-Frontend?style=plastic)](https://github.com/ita-social-projects/OoS-Frontend/issues)
[![Pending Pull-Requests](https://img.shields.io/github/issues-pr/ita-social-projects/OoS-Frontend?style=plastic)](https://github.com/ita-social-projects/OoS-Frontend/pulls)
![GitHub](https://img.shields.io/github/license/ita-social-projects/OoS-Frontend?style=plastic)

---

## Table of Contents

- [Backend](#Backend)
- [Installation](#Installation)
  - [Required to install](#Required-to-install)
  - [Clone](#Clone)
- [Usage](#Usage)
  - [Development server](#Development-server)
  - [Code scaffolding](#Code-scaffolding)
  - [Build](#Build)
  - [Running unit tests](#Running-unit-tests)
  - [Running end-to-end tests](#Running-end-to-end-tests)
  - [Further help](#Further-help)
- [Documentation](#Documentation)
- [Contributing](#Contributing)
  - [Git flow](#Git-flow)
  - [Issue flow](#Issue-flow) <!-- Move to next line - [Contributors](#Contributors) -->
- [FAQ](#FAQ)
- [Support](#Support)
- [License](#License)

---

## Backend

Here is the back-end part of our project: [https://github.com/ita-social-projects/OoS-Backend](https://github.com/ita-social-projects/OoS-Backend).

`develop` branch of the front-end corresponds to `develop` branch on the back-end. The same thing with `main` branches.

## Installation

### Required to install
* [Node.js 16/18](https://nodejs.org/en/download)
* [Yarn Package Manager 1.x](https://classic.yarnpkg.com/lang/en/docs/install)
* [Angular CLI 16](https://angular.io/cli)

### Clone

Clone this repo to your local machine using `git clone https://github.com/ita-social-projects/OoS-Frontend`

---

## Usage

### Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io/).

### Running end-to-end tests

Run `yarn e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

---

## Documentation

#### Tech stack

- GitHub Actions are used to run unit tests & assign reviewers and Google Cloud Platform as CI/CD tool to deploy project
- Angular 16 & TypeScript 5 are used to develop project
- nginx is used as web server on deploy
- Jest and Cypress are used for unit & end-to-end testing
- Prettier and ESLint are used to provide formatting and code-style rules & linting
- SonarCloud is used for code coverage & code smells & reliability

#### General terms and concepts

- **Admin** (tech, ministry, region, territorial community/area) - person that is responsible of managing entire portal or specific local flow restricted by role
- **Provider** - person or organization that provides out-of-school services and manages its info and workshops
  - **Provider Deputy**, **Workshop Administrator** - responsible of supporting Provider, managing specific scope or only workshop/workshops
- **Parent** - user that manages and applies children to the workshops, main 'client' of portal
  - **Child** - can be applied to workshop and gain achievements
- **Application** - request by parent to apply his child to workshop
- **Direction** - category of workshop activities
- **Institution** - state organization

#### Project structure

- **app** - main source code folder and Angular top-module
  - **shared** - module with widely-used components, services, directives, utils etc.
    - **store** - folder that contains NGXS injectable state & actions
  - **shell** - module and placeholder for different functional units
    - **admin-tools** - admin panel that allows to manage portal, users, other admins
      - **data** - module that contains functional to manage admins, applications, directions, providers, users, statistics, history log
      - **platform** - module that allows to manage whole platform info
    - **details** - detailed pages of providers and workshops
    - **info** - platform info pages, rules, support for users
    - **personal-cabinet** - pages for personal usage of parents, providers etc.
    - **result** - page that allows to search & filter workshops or use map for searching them
- **assets** - styles, media, translation and other non-functional content
- **environments** - env variables which depends on configuration

---

## Contributing

### Git flow

To get started...

1. Install [required dependencies](Required-to-install) and pick some code editor or IDE that is suitable for you:
    - [Visual Studio Code by Microsoft](https://code.visualstudio.com/) - popular editor with rich extensions provided to use (we have extensions for this editor that will be offered to install once you load project)
    - [WebStorm by JetBrains](https://www.jetbrains.com/webstorm/) (paid but free for [students](https://www.jetbrains.com/community/education/#students)) - powerful and comprehensive IDE with useful built-in tools provided
    - [Sublime Text](https://www.sublimetext.com/) - lightweight and fast code editor
    - even Vim or Notepad will be fine but not much ready-to-develop as previous tools

2. [Clone](#Clone) this repo using HTTPS, SSH (requires [additional set-up](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)), [GitHub CLI](https://cli.github.com/) or version control tool in your editor/IDE.

3. Pick some [issue](https://github.com/ita-social-projects/OoS-Frontend/issues) you interested of, feel free to ask questions in members of project or write comments, and when you're ready - assign yourself and get started.

4. **HACK AWAY!** 🔨🔨🔨

5. Create a [new pull request](https://github.com/ita-social-projects/OoS-Frontend/compare/) and provide enough description for it.

6. After code review resolve the issues or if there's none of them - **merge** and you're done!

### Issue flow

- **bug** - the issue of some functional doesn't work as expected
- **backend** - related to backend so have to be discussed or done by this side
- **improvement** - suggestion to enhance functionality
- **severity** - describes a level of impact for entire application
- **priority** - describes a level of urgency for issue to be done
- **ui** - related directly to ui flow
- **documentation** - describes some data related mostly to dev flow, describe complicated cases or agree some team principles
- **freezed** - is prevented to develop by some of minor causes
- **task** - related to user story or represent it and provides new functionality
- **bug:fixed** - PR with fixes merged and waiting for QC to approve that
- **validated** - issue is checked by QC and is resolved now
- **good first issue** - suitable for newcomers and not very complicated
- **help wanted** and **question** - need for dev team/QC/PM or required person's attention, help of information

---
<!-- ## Contributors

TODO: Complete section

> Backend

[<img src="https://avatars.githubusercontent.com/u/69301010?s=100&v=4" width="100" height="100">](https://github.com/yfedo)
[<img src="https://avatars.githubusercontent.com/u/24808838?s=100&v=4" width="100" height="100">](https://github.com/DmyMi)
[<img src="https://avatars.githubusercontent.com/u/62392669?s=100&v=4" width="100" height="100">](https://github.com/YehorOstapchuk)
[<img src="https://avatars.githubusercontent.com/u/45245513?s=100&v=4" width="100" height="100">](https://github.com/Elizabeth129)
[<img src="https://avatars.githubusercontent.com/u/55458556?s=100&v=4" width="100" height="100">](https://github.com/mmmpolishchuk)
[<img src="https://avatars.githubusercontent.com/u/3800688?s=100&v=4" width="100" height="100">](https://github.com/dmitrykiev)
[<img src="https://avatars.githubusercontent.com/u/10594407?s=100&v=4" width="100" height="100">](https://github.com/SergeyNovitsky)
[<img src="https://avatars.githubusercontent.com/u/13885098?s=100&v=4" width="100" height="100">](https://github.com/h4wk13)
[<img src="https://avatars.githubusercontent.com/u/85107137?s=100&v=4" width="100" height="100">](https://github.com/VadymLevkovskyi)
[<img src="https://avatars.githubusercontent.com/u/73526573?s=100&v=4" width="100" height="100">](https://github.com/v-ivanchuk)
[<img src="https://avatars.githubusercontent.com/u/67432351?s=100&v=4" width="100" height="100">](https://github.com/VyacheslavDzhus)
[<img src="https://avatars.githubusercontent.com/u/59091855?s=100&v=4" width="100" height="100">](https://github.com/OlhaHoliak)
[<img src="https://avatars.githubusercontent.com/u/50420213?s=100&v=4" width="100" height="100">](https://github.com/P0linux)
[<img src="https://avatars.githubusercontent.com/u/47710368?s=100&v=4" width="100" height="100">](https://github.com/Bogdan-Hasanov)

> Frontend

> Business Analytics

> Testers

--- -->
## FAQ

    - No problem! Just do this.
    - Feel free to reach team members.
    - Debug, investigate, but don't push yourself too hard.
    - Rest enough.

---

## Support

Reach us by creating issue, write comments or any suitable way for you.

---

## License

![GitHub](https://img.shields.io/github/license/ita-social-projects/OoS-Frontend?style=plastic)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2021 © <a href="https://softserve.academy/" target="_blank"> SoftServe IT Academy</a>.
