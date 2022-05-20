# This Template was dcloned from Notus React 

## Files and Folder

This is the project structure that you will get upon the download:
```
notus-react
.
├── CHANGELOG.md
├── ISSUE_TEMPLATE.md
├── LICENSE.md
├── README.md
├── gulpfile.js
├── jsconfig.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── assets
│   │   ├── img
│   │   │   ├── all images are stored here
│   │   └── styles
│   │       ├── index.css
│   │       └── tailwind.css
│   ├── components
│   │   ├── Cards
│   │   │   ├── CardBarChart.js
│   │   │   ├── CardLineChart.js
│   │   │   ├── CardPageVisits.js
│   │   │   ├── CardProfile.js
│   │   │   ├── CardSettings.js
│   │   │   ├── CardSocialTraffic.js
│   │   │   ├── CardStats.js
│   │   │   └── CardTable.js
│   │   ├── Dropdowns
│   │   │   ├── IndexDropdown.js
│   │   │   ├── NotificationDropdown.js
│   │   │   ├── PagesDropdown.js
│   │   │   ├── TableDropdown.js
│   │   │   └── UserDropdown.js
│   │   ├── Footers
│   │   │   ├── Footer.js
│   │   │   ├── FooterAdmin.js
│   │   │   └── FooterSmall.js
│   │   ├── Headers
│   │   │   └── HeaderStats.js
│   │   ├── Maps
│   │   │   └── MapExample.js
│   │   ├── Navbars
│   │   │   ├── AdminNavbar.js
│   │   │   ├── AuthNavbar.js
│   │   │   └── IndexNavbar.js
│   │   └── Sidebar
│   │       └── Sidebar.js
│   ├── index.js
│   ├── layouts
│   │   ├── Admin.js
│   │   └── Auth.js
│   └── views
│       ├── Index.js
│       ├── admin
│       │   ├── all admin pages are found here (dashboard, teams etc)
│       └── auth
│           ├── all auth pages are stored here (login, password reset etc)
└── tailwind.config.js
```

## Running the project

Yarn package manager is used follow the steps below

``` yarn install```

``` yarn build:tailwind ``` (Optional)

``` yarn start ```

## Things to NOTE

The tailwind CSS was compiled by Notus React so some classes may seem different. Read [the documentation](https://www.creative-tim.com/learning-lab/tailwind/react/overview/notus) to view the custom classes

Whenever you add a new class you'll need to run ``` yarn build:tailwind ``` to load the new classes

