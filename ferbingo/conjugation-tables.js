const tables = {
  conj1: `
  <pre>
  MOOD VOICE TENSE   SINGULAR        PLURAL
                 1    2       3       1       2       3
INDC ACTV  PRES  -o   -as     -at     -amus   -atis    -ant
           PAST -abo  -abas   -abat   -abamus -abatis  -abant
           FUTR Present with 'vod' after
           FUTP Past with 'vod' after
           PLUP -ijo  -is     -it     -imus   -itis    -ijûnt
     PASV  PRES -au   -asu    -atu    -amu    -amini   -antu
           PAST -abor -abaris -abatur -abamur -abamini -abantur
           FUTR Present with 'vod' after
           FUTP Past with 'vod' after
           PLUP -iv   -isu    -itu    -imu    -imini   -untu
SUBJ ACTV  PRES -eijo -es     -et     -emus   -etis    -eijûnt
           PAST -ebo  -ebas   -ebat   -ebamus -ebatis  -ebant
           FUTR Present with 'vod' after
           FUTP Past with 'vod' after
           Note: Prefix PLUP with k\u02b7. Example: amare > k\u02b7amo, -amas, -amat, ...
           PLUP = INDC ACTV with k\u02b7 prefix
     PASV  PRES -eu   -esu    -etu    -emu    -emini   -entu
           PAST -ebor -ebaris -ebatur -ebamur -ebamini -ebantur
           FUTR Present with 'vod' after
           FUTP Past with 'vod' after
           Note: Prefix PLUP with k\u02b7. Example: amare > k\u02b7amau, -amasu, -amatu, ...
           PLUP = INDC PASV with k\u02b7 prefix
           









           Gerunds:
               SING  PLUR
           NOM -an  -anes
           ACC -aġ  -anei
           GEN -ant -antst
           DAT -ani -anehi
           
           
  </pre>
  `,
  conj2: ``,
  conj3: `<pre>
MOOD VOICE TENSE SINGULAR        PLURAL
                 1  2   3   1     2     3
INDC ACTV  PRES  -o -is -it -imus -itis -unt
  </pre>`,
  conj4: ``,
  //TODO: make verb conj tables
};

var nouns = {
  decl3: `<pre>
  CASE SINGULAR PLURAL
  NOM  -e       -es
  GEN  -t, -et  -st, -est
  DAT  -ebi     -ehi
  ACC  -em      -ei
  ABL  -e       -es
  VOC  -é       -és</pre>`,
};
export default [tables, nouns];
