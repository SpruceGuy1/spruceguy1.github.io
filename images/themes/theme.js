export function theme(document) {
  var sitelen_pi_tenpo_muno;
  switch (Math.floor(new Date().getMonth() / 2)) {
    case 0:
      sitelen_pi_tenpo_muno = "jan-feb";
      break;
    case 1:
      sitelen_pi_tenpo_muno = "mar-apr";
      break;
    case 2:
      sitelen_pi_tenpo_muno = "may-jun";
      break;
    case 3:
      sitelen_pi_tenpo_muno = "jul-aug";
      break;
    case 4:
      sitelen_pi_tenpo_muno = "sep-oct";
      break;
    case 5:
      sitelen_pi_tenpo_muno = "nov-dec";
      break;
  }
  document.body.append(
    "<img src='/images/themes/" +
      sitelen_pi_tenpo_muno +
      ".png' style='height:64px;width:64px;'>",
  );
}
/*
import {theme} from /images/themes/theme.js;
theme(document)
*/
