'use strict';
const payload = "Robert'); DROP TABLE Students;--";
const nameInput = document.querySelector('#name');
const query = document.querySelector('#query');
const result = document.querySelector('#result');
const modes = [...document.querySelectorAll('[name=mode]')];
function isSafe(){return modes.find(r=>r.checked).value === 'safe';}
function preview(){
 const safe=isSafe();
 query.textContent=safe?'INSERT INTO Students (name) VALUES ($1);':`INSERT INTO Students (name) VALUES ('${nameInput.value}');`;
 document.querySelector('#binding-wrap').hidden=!safe;
 document.querySelector('#binding').textContent=JSON.stringify(nameInput.value);
 document.querySelector('#mode-label').textContent=safe?'BOUND PARAMETER':'CONCATENATED';
 result.className='result';result.textContent='Ready. Run the simulation to see the outcome.';
 document.querySelector('#register').hidden=false;document.querySelector('#new-row').hidden=true;
}
document.querySelector('#normal').onclick=()=>{nameInput.value='Robert';preview();};
document.querySelector('#bobby').onclick=()=>{nameInput.value=payload;preview();};
nameInput.addEventListener('input',preview);modes.forEach(r=>r.addEventListener('change',preview));
document.querySelector('#run').onclick=()=>{
 const value=nameInput.value;
 if(!value.trim()){result.className='result';result.textContent='Enter a student name first.';return;}
 if(isSafe()){
  result.className='result safe';result.textContent='Name stored as data. The SQL structure stays unchanged—even when the name looks like a command.';
 }else if(value===payload){
  result.className='result danger';result.textContent='Table dropped in this simulation. The input ended the INSERT and introduced a second SQL statement.';
  document.querySelector('#register').hidden=true;return;
 }else if(/[\x27;]/.test(value)||value.includes('--')){
  result.className='result danger';result.textContent='Untrusted input is embedded in the SQL. This teaching model does not parse arbitrary SQL; syntax errors or other behavior depend on the database and driver. Switch to parameters.';return;
 }else{
  result.className='result';result.textContent='Student added in this example. It worked for this input, but concatenation still leaves the query vulnerable.';
 }
 document.querySelector('#register').hidden=false;document.querySelector('#new-row').hidden=false;document.querySelector('#new-name').textContent=value;
};
preview();
