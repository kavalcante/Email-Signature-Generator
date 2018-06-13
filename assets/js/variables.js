//// Global vars
//////
// setup vars ***
//////
var companyName = 'Nutrir';
var companyInitals = 'Nutrir';
// server path ***
// this may change based on your local or live server set
var www = "";
if(window.location.href.indexOf("www") > -1){ www = "www."};
var serverPath = "http://localhost:8080";
// custom video tutorial link
var tutorialVideoLink = serverPath + "/assets/tutorial/lane-college-signature-tutorial_s.mp4";
// defaults
var first, signature;

// collect headshots of people (staff)
var teamImgs = ["", "No Photo"];
var fileExt = ".jpg";
function getTeamImages(){
  return true
}

//////
// Start Signature CMS
//////
$(document).ready(function() {
  // update company name
  $('#company-name').text(companyName);
  // update tutorial link
  $('#tutorialVideo a').attr('href', tutorialVideoLink);

  // setup ZeroClipboard
  var client = new ZeroClipboard($('#copy-button'), {
      moviePath : 'util/assets/js/vendor/ZeroClipboard.swf'
  });

  // add text fields ***
  // createTextField(label, id, placeholder)
  $.when(getTeamImages()).done(function(results){
    $(results).find("a:contains(" + fileExt + ")").each(function () {
      teamImgs.push($(this).text().trim());
    });
    // createDataSelectBox("Add your headshot", "headshot", teamImgs);
    $(".chosen-select").chosen({width: "100%"});
    createTextField("Nome*", "first", "João");
    createTextField("Sobrenome*", "last", "Cavalcante");
    createTextField("Cargo", "title", "Director of Awesomeness");
    createTextField("Telefone", "phone", "(11) 1234-5678");
    createTextField("E-mail", "email", "kavalcante@nutrir.agr.br");
  });
});

// on submit button click
function buidSignature() {
  showControls(true);

  //Get the value of input fields with id="INPUT-FIELD-ID" ***
  first = document.getElementById("first").value;
  last = document.getElementById("last").value;
  creds = '';
  if(creds !== '') creds = ', ' + creds;
  title = document.getElementById("title").value;
  division = '';
  phone = formatPhoneNumber( document.getElementById("phone").value );
  email = document.getElementById("email").value;

  $.ajax({
    url:"./dist/code.html",  
    success:function(data) {
      headshot = '';
      // put in all the variables need here ***
      // to add data for `dist/code.html` email signature template
      signature = convertStringToTemplate(
        data, 
        headshot, 
        first, 
        last, 
        creds, 
        title, 
        phone, 
        email, 
        serverPath
      );
      console.log(headshot);

      // if headshot is empty or null ...whatever
      if(headshot=='' || headshot=="No Photo")
        signature = moveCompanyLogo(signature, "#top-logo", "#bottom-logo");

      // optional fields ***
      if(creds===''){signature = removeElementFromTemplate('creds', signature);}
      if(title===''){signature = removeElementFromTemplate('title', signature);}
      if(division===''){signature = removeElementFromTemplate('division', signature);}
      if(phone===''){signature = removeElementFromTemplate('phone', signature);}
      if(email===''){signature = removeElementFromTemplate('email', signature);}

      // show the results && pass the first name for file download
      presentSignature(first, signature);
    }
  });
}