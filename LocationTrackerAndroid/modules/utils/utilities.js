import _ from 'lodash';
import { AsyncStorage } from 'react-native';
import { STATE, STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED } from '../common/constants';

export const saveState = async (state) => {
	try {
		const serializedState = JSON.stringify(state);
		await AsyncStorage.setItem(STATE, serializedState);
	}
	catch(err) {
		console.error(err);
	}
}

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
export function trimNo(input) {
	let output = input.replace(/\s/g, '');
	output = replaceAll(output,',','');
	output = replaceAll(output,'-','');
	output = replaceAll(output,'+','');
	output = replaceAll(output,'(','');
	output = replaceAll(output,')','');
	return output;
}

export function mergedList(a1, a2) {
	try{
		if(a1!==undefined && a1!==null && a1.length>0) {
			let exists = false;
			let index = 0;
			let counter = -1;
			a1.forEach((item)=>{
				index++;
				if(item.recordID === a2.recordID){
					counter = index;
				}
			});
			if(counter>-1) {
				a1 = a1.splice(counter, 1);
			}
			a1 = [a2, ...a1];
		}
		else {
			a1 = [a2];
		}
	}
	catch(err) {
		console.log(err);
	}
    return a1; 
} 

export function getStatus(s) {
	if(s !==undefined && s !== null && s !== '') {
		switch(s) {
			case STATUS_PENDING:
				return "Pending";
			case STATUS_APPROVED: 
				return "Sharing";
			case STATUS_REJECTED:
				return "Not there";
		}
	}
	else {
		return 'Offline';
	}
}