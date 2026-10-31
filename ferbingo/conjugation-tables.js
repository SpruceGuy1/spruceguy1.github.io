const tables = {
  conj1: `
  <pre>
  MOOD VOICE TENSE  SINGULAR        PLURAL
                 1   2     3     1       2       3
INDC ACTV  PRES  -o  -as   -at   -amus   -atis   -ant
           PAST -abo -abas -abat -abamus -abatis -abant
           FUTR Present with 'vod' after
           FUTP Past with 'vod' after
           PLUP -ijo -is   -it   -imus   -itis   -ijûnt








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
