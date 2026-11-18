const $ = id => document.getElementById(id);
const fields = ['customerName','phone','email','quoteDate','address','carrier','otherCarrier','policyType','policyNumber','policyTerm','effectiveDate','expirationDate','riskDetails','coverage','collisionDeductible','comprehensiveDeductible','premium','downPayment','agencyFee','installments','paymentArrangement','financeRate','monthlyPayment','agent','office','notes'];
const money = value => (Number(value)||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
const value = id => $(id).value.trim();
const packageValue = () => document.querySelector('input[name="coveragePackage"]:checked')?.value || 'Basic Liability';
const carrierValue = () => value('carrier') === 'Other / Not listed' ? (value('otherCarrier') || 'Other carrier') : (value('carrier') || 'Not specified');
const setText = (id, text) => { $(id).textContent = text || '—'; };
function packageDescription(){
  const selected=packageValue();
  const collision=value('collisionDeductible'), comprehensive=value('comprehensiveDeductible');
  let lines=[];
  if(selected==='Basic Liability') lines=['Liability-focused coverage package'];
  if(selected==='Standard') lines=['Standard coverage package'];
  if(selected==='Full Coverage') lines=['Full coverage package'];
  if(collision!=='Not included' && selected!=='Basic Liability') lines.push(`Collision deductible: ${money(collision)}`);
  if(comprehensive!=='Not included' && selected!=='Basic Liability') lines.push(`Comprehensive deductible: ${money(comprehensive)}`);
  if(value('coverage')) lines.push(value('coverage'));
  return lines.join('\n');
}
function updatePreview(){
  const premium=Math.max(0,Number(value('premium'))||0), down=Math.max(0,Number(value('downPayment'))||0);
  const count=Math.max(0,Number(value('installments'))||0), fee=Math.max(0,Number(value('agencyFee'))||0);
  const financedAmount=Math.max(0,premium-down), isFinanced=value('paymentArrangement')==='financed';
  const financeRate=isFinanced?Math.max(0,Number(value('financeRate'))||0):0;
  const estimatedFinanceCharge=financedAmount*(financeRate/100);
  const calculatedMonthly=count?(financedAmount+estimatedFinanceCharge)/count:0;
  const manualMonthly=value('monthlyPayment')!=='';
  const monthly=count?(manualMonthly?Math.max(0,Number(value('monthlyPayment'))||0):calculatedMonthly):0;
  const installmentTotal=monthly*count, total=down+installmentTotal;
  const actualFinanceCharge=isFinanced?Math.max(0,total-premium):0;
  setText('calcDown',money(down));
  setText('calcInstallments',count?`${money(monthly)} × ${count}`:'Paid in full');
  setText('calcTotal',money(total));
  $('financeRateWrap').hidden=!isFinanced;
  $('financeSummary').hidden=!isFinanced;
  setText('calcFinanceCharge',money(manualMonthly?actualFinanceCharge:estimatedFinanceCharge));
  setText('calcFinancedAmount',money(financedAmount));
  $('monthlyMode').textContent=manualMonthly?'Custom monthly payment entered':'Suggested payment calculated automatically';
  $('autoMonthlyBtn').hidden=!manualMonthly;
  setText('pName',value('customerName')||'Customer name'); setText('pAddress',value('address')||'');
  const contact=[value('phone'),value('email')].filter(Boolean).join(' · '); setText('pContact',contact||'');
  setText('pQuoteDate',value('quoteDate')?new Date(value('quoteDate')+'T12:00:00').toLocaleDateString('en-US'):'—');
  setText('pPolicyNumber',value('policyNumber')||'—');
  setText('pEffective',value('effectiveDate')?new Date(value('effectiveDate')+'T12:00:00').toLocaleDateString('en-US'):'—');
  setText('pCarrier',carrierValue()); setText('pType',value('policyType')); setText('pTerm',value('policyTerm'));
  setText('pRisk',value('riskDetails')||'Not specified'); setText('pPackage',packageValue());
  setText('pCoverage',packageDescription());
  setText('pCollision',packageValue()==='Basic Liability'||value('collisionDeductible')==='Not included'?'Not included':money(value('collisionDeductible')));
  setText('pComprehensive',packageValue()==='Basic Liability'||value('comprehensiveDeductible')==='Not included'?'Not included':money(value('comprehensiveDeductible')));
  setText('pPremium',money(premium)); setText('pDown',money(down)); setText('pFee',money(fee));
  setText('pMonthly',count?`${money(monthly)} per payment`:'Paid in full');
  setText('pInstallmentLabel',count?`${count} ${value('paymentArrangement')==='financed'?'finance':'scheduled'} installments`:'No installments');
  setText('pTotal',money(total));
  $('pFinanceLine').hidden=!isFinanced;
  setText('pFinanceCharge',money(actualFinanceCharge));
  setText('pTotalNote',isFinanced?'Down payment + financed installments (agency fee separate)':'Down payment + scheduled installments (agency fee separate)');
  $('pNotesSection').hidden=!value('notes'); setText('pNotes',value('notes')); setText('pOffice',value('office')||'Massachusetts');
  $('otherCarrierWrap').hidden=value('carrier')!=='Other / Not listed';
  $('saveStatus').textContent='● Changes saved in this browser';
}
function save(){const data={};fields.forEach(id=>data[id]=$(id).value);data.coveragePackage=packageValue();try{localStorage.setItem('aaQuoteDraft',JSON.stringify(data));}catch(e){}}
function load(){try{const data=JSON.parse(localStorage.getItem('aaQuoteDraft')||'{}');fields.forEach(id=>{if(data[id]!==undefined)$(id).value=data[id];});if(data.coveragePackage){const radio=document.querySelector(`input[name="coveragePackage"][value="${data.coveragePackage}"]`);if(radio)radio.checked=true;}}catch(e){}}
function clearForm(){fields.forEach(id=>{if(id==='policyType')$(id).value='Personal Auto';else if(id==='policyTerm')$(id).value='12 months';else if(id==='agencyFee')$(id).value='100.00';else if(id==='installments')$(id).value='9';else if(id==='paymentArrangement')$(id).value='carrier';else if(id==='financeRate')$(id).value='0';else if(id==='collisionDeductible'||id==='comprehensiveDeductible')$(id).value='1000';else if(id==='quoteDate')$(id).value=new Date().toISOString().slice(0,10);else $(id).value='';});document.querySelector('input[name="coveragePackage"][value="Basic Liability"]').checked=true;save();updatePreview();}
function printQuote(){updatePreview();window.print();}
fields.forEach(id=>$(id).addEventListener('input',()=>{updatePreview();save();}));
$('paymentArrangement').addEventListener('change',()=>{if(value('paymentArrangement')==='paid'){$('installments').value='0';$('monthlyPayment').value='';}else if(value('installments')==='0')$('installments').value='9';updatePreview();save();});
$('autoMonthlyBtn').addEventListener('click',()=>{$('monthlyPayment').value='';updatePreview();save();});
['carrier','policyType','policyTerm','collisionDeductible','comprehensiveDeductible','installments','paymentArrangement'].forEach(id=>$(id).addEventListener('change',()=>{updatePreview();save();}));
document.querySelectorAll('input[name="coveragePackage"]').forEach(el=>el.addEventListener('change',()=>{updatePreview();save();}));
$('printBtn').addEventListener('click',printQuote);$('printBtnBottom').addEventListener('click',printQuote);
$('resetBtn').addEventListener('click',()=>{if(confirm('Clear all quote fields?'))clearForm();});
$('newQuoteBtn').addEventListener('click',()=>{if(confirm('Start a new quote? The current draft will be cleared.'))clearForm();});
$('year').textContent=new Date().getFullYear(); load(); if(!value('quoteDate'))$('quoteDate').value=new Date().toISOString().slice(0,10); updatePreview();
