export function checkPassword(password) {

  let matchedCase = [];
  matchedCase.push("[$@$!%*#?&]");
  matchedCase.push("[A-Z]");
  matchedCase.push("[0-9]");
  matchedCase.push("[a-z]");

  // Check the conditions
  var ctr = 0;
  for (var i = 0; i < matchedCase.length; i++) {
    if (new RegExp(matchedCase[i]).test(password)) {
      ctr++;
    }
  }

  return (ctr >= 3) ? true : false;
}
