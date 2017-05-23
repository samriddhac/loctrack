import _ from 'lodash';

export function convertContacts(cntList) {
	let contacts = [];
	if(cntList!==undefined && cntList!==null && cntList.length>0) {
		cntList.forEach((item)=> {
			if(item.phoneNumbers!==undefined && 
			item.phoneNumbers!==null && item.phoneNumbers.length>0) 
			{
				let phno =0;
				item.phoneNumbers.forEach((ph)=>{
					if(ph.label==='mobile'){
						phno = ph.number;
					}
				});
				if(phno !== undefined && phno !== null && phno!==0) {
				let phStr = trimNo(phno);
				let obj = {
						recordID:item.recordID,
						givenName: item.givenName,
						familyName: item.familyName,
						thumbnailPath: item.thumbnailPath,
						phno:phStr,
						searchName: item.givenName + ' ' + item.familyName
					};
					contacts = [...contacts, obj];
				}
			}	
			});
	}
	return contacts;
}
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function trimNo(input) {
	let output = input.replace(/\s/g, '');
	output = replaceAll(output,',','');
	output = replaceAll(output,'-','');
	output = replaceAll(output,'+','');
	output = replaceAll(output,'(','');
	output = replaceAll(output,')','');
	return output;
}

export function mergedList(a1, a2) {
	if(a1!==undefined && a1!==null && a1.length>0) {
		let exists = false;
		a1.forEach((item)=>{
			if(item.recordID === a2.recordID){
				exists = true;
			}
		});
		if(!exists){
			a1 = [...a1, a2];
		}
	}
	else {
		a1 = [...a1, a2];
	}
    return a1; 
} 