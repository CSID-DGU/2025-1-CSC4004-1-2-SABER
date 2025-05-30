import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Noto Sans Variable';
    src: url('../assets/NotoSans-VariableFont_wdth,wght.ttf') format('truetype-variations');
    font-weight: 100 900;
    font-stretch: 75% 125%;
  }

  body {
    margin: 0;
    /* styled-components 컴포넌트들이 기본적으로 이 폰트를 상속받도록 설정 */
    font-family: 'Noto Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /*
  * 다른 모든 styled-components로 생성된 컴포넌트들이
  * 명시적으로 font-family를 지정하지 않는 한
  * body의 font-family를 상속받도록 하려면 아래와 같이 설정합니다.
  */
  * {
    /* box-sizing은 폰트와 직접 관련 없지만, 일반적으로 전역에서 설정하는 좋은 관행 */
    box-sizing: border-box;
  }

  /*
  * 만약 styled-components로 만든 특정 요소들이 폰트가 적용 안 된다면
  * 아래처럼 styled-components가 생성하는 클래스를 타겟팅하여 명시적으로 폰트를 지정할 수 있습니다.
  * (styled-components는 고유한 클래스명을 생성합니다. 아래는 일반적인 예시)
  */
  .sc-eCImPb.iHjQcM { /* 예시: styled-components가 생성한 클래스명 */
    font-family: 'Noto Sans Variable', sans-serif;
  }
`;

export default GlobalStyle;