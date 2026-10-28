import S00_Overture from './sections/S00_Overture';
import S01_Film from './sections/S01_Film';
import S02_Engine from './sections/S02_Engine';
import S03_Components from './sections/S03_Components';
import S04_Numbers from './sections/S04_Numbers';
import S05_Colophon from './sections/S05_Colophon';

export default function App() {
  return (
    <main>
      <S00_Overture />
      <S01_Film />
      <S02_Engine />
      <S03_Components />
      <S04_Numbers />
      <S05_Colophon />
    </main>
  );
}
