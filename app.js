const $ = id => document.getElementById(id);
const fields = ['customerName','phone','email','quoteDate','address','carrier','policyType','policyNumber','policyTerm','effectiveDate','expirationDate','riskDetails','coverage','collisionDeductible','comprehensiveDeductible','premium','downPayment','agencyFee','monthlyPayment','installments','frequency','agent','office','notes'];
const money = value => (Number(value)||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
const value = id => $(id).value.trim();
const setText = (id, text) => { $(id).textContent = text || '—'; };
function updatePreview(){
  const premium=Number(value('premium'))||0, down=Number(value('downPayment'))||0;
  const monthly=Number(value('monthlyPayment'))||0, count=Math.max(0,Number(value('installments'))||0);
  const fee=Number(value('agencyFee'))||0, installmentTotal=monthly*count, total=down+installmentTotal;
  setText('calcDown',money(down)); setText('calcInstallments',money(installmentTotal)); setText('calcTotal',money(total));
  setText('pName',value('customerName')||'Customer name');
  setText('pAddress',value('address')||'Customer address');
  const contact=[value('phone'),value('email')].filter(Boolean).join(' · ');
  setText('pContact',contact||'Phone · Email');
  setText('pQuoteDate',value('quoteDate')?new Date(value('quoteDate')+'T12:00:00').toLocaleDateString('en-US'):'—');
  setText('pPolicyNumber',value('policyNumber')||'—');
  setText('pEffective',value('effectiveDate')?new Date(value('effectiveDate')+'T12:00:00').toLocaleDateString('en-US'):'—');
  setText('pCarrier',value('carrier')||'Not specified'); setText('pType',value('policyType'));
  setText('pTerm',value('policyTerm')); setText('pRisk',value('riskDetails')||'Not specified');
  setText('pCoverage',value('coverage')||'Coverage details will appear here.');
  setText('pCollision',value('collisionDeductible')?money(value('collisionDeductible')):'—');
  setText('pComprehensive',value('comprehensiveDeductible')?money(value('comprehensiveDeductible')):'—');
  setText('pPremium',money(premium)); setText('pDown',money(down)); setText('pFee',money(fee));
  setText('pMonthly',`${money(monthly)} ${value('frequency').toLowerCase()}`);
  setText('pInstallmentLabel',`${count} ${value('frequency').toLowerCase()} installments`);
  setText('pTotal',money(total));
  $('pNotesSection').hidden=!value('notes'); setText('pNotes',value('notes'));
  setText('pOffice',value('office')||'Massachusetts');
  const status=$('saveStatus'); status.textContent='● Changes saved in this browser';
}
function save(){const data={};fields.forEach(id=>data[id]=$(id).value);try{localStorage.setItem('aaQuoteDraft',JSON.stringify(data));}catch(e){}}
function load(){try{const data=JSON.parse(localStorage.getItem('aaQuoteDraft')||'{}');fields.forEach(id=>{if(data[id]!==undefined)$(id).value=data[id];});}catch(e){}}
function clearForm(){fields.forEach(id=>{if(id==='policyType')$(id).value='Personal Auto';else if(id==='policyTerm')$(id).value='12 months';else if(id==='agencyFee')$(id).value='100.00';else if(id==='installments')$(id).value='9';else if(id==='frequency')$(id).value='Monthly';else if(id==='quoteDate')$(id).value=new Date().toISOString().slice(0,10);else $(id).value='';});save();updatePreview();}
function printQuote(){updatePreview();window.print();}
fields.forEach(id=>$(id).addEventListener('input',()=>{updatePreview();save();}));
$('printBtn').addEventListener('click',printQuote);$('printBtnBottom').addEventListener('click',printQuote);
$('resetBtn').addEventListener('click',()=>{if(confirm('Clear all quote fields?'))clearForm();});
$('newQuoteBtn').addEventListener('click',()=>{if(confirm('Start a new quote? The current draft will be cleared.'))clearForm();});
$('year').textContent=new Date().getFullYear();
load();if(!value('quoteDate'))$('quoteDate').value=new Date().toISOString().slice(0,10);updatePreview();
