1. 사용 모듈

1) global



2) production
- react : 
- react-dom

- redux
- react-redux
- redux-thunk 
- redux-logger

- jquery
- jquery-ui
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

- react-bootstrap : react component로 구현된 bootstrap 
* Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't ship with any included css. 
However, some stylesheet is required to use these components. - by react-bootstrap
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">

3) development
- webpack :
모듈 번들러로서, Browserify 처럼 브라우저 위에서 import (require) 을 할 수 있게 해주고 
자바스크립트 파일들을 하나로 합쳐줍니다.
- webpack-dev-server :
wepback에서 지원하는 간단한 개발서버로서 
별도의 서버를 구축하지 않고도 웹서버를 열 수 있으며 
hot-loader를 통하여 코드가 수정될때마다 자동으로 리로드 되게 할 수 있습니다.
- babel 관련
$ npm install --save-dev babel-core babel-loader babel-preset-react babel-preset-es2015 webpack webpack-dev-server

babel-plugin-transform-decorators-legacy : @(decorator) syntax를 이용할 수 있게 해주는 plugin으로 .babelrc에 명시됨 

-css 관련
$ npm install --save-dev style-loader css-loader

추후 설치
product
- router
- react-addons-update : state 원소 수정, 삭제, 삽입에 도움이 되는 module
- draft.js :SpeechBubble.js에 있는 말 풍선 글을 수정 할 수 있는 text editing module
- html2canvas : PageDecorator.js에 있는 html요소를 canvas요소로 변환해주는 module