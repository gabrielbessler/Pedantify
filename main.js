currReplacement = "min";

function init(){
  // Assigning variables to all elements we use
  percentReplVal = document.getElementById('percReplValue');
  percentReplSlider = document.getElementById('slider1');
  minBtn = document.getElementById('minBtn');
  maxBtn = document.getElementById('maxBtn');
  randBtn = document.getElementById('randBtn');
  text_area = document.getElementById('textArea1');
  resetOptionsBtn = document.getElementById('resetOptionsBtn');

  // Setting the initial value of the progress bar
  percentReplVal.innerHTML = percentReplSlider.value + "%";

  minBtn.style.color = "#e88b2e";

  addEventListeners();
}

function addEventListeners(){
  percentReplSlider.addEventListener("input", function(){
    percentReplVal.innerHTML = percentReplSlider.value + "%";
  });

  resetBtn = document.getElementById("resetBtn")
  resetBtn.addEventListener("click", function(){
    text_area.value = "";
  });

  minBtn.addEventListener('click', function(){
    selectMinButton();
  });
  maxBtn.addEventListener('click', function(){
    maxBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    randBtn.style.color = "white";
    currReplacement = "max";
  });
  randBtn.addEventListener('click', function(){
    randBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    maxBtn.style.color = "white";
    currReplacement = "click";
  });
  resetOptionsBtn.addEventListener('click', function(){
    selectMinButton();
    percentReplSlider.value = 50;
    percentReplVal.innerHTML = percentReplSlider.value + "%";
  });
}
function selectMinButton()
{
  minBtn.style.color = "#e88b2e";
  maxBtn.style.color = "white";
  randBtn.style.color = "white";
  currReplacement = "min";
}
