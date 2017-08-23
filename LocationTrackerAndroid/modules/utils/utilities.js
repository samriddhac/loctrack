import _ from 'lodash';
import { AsyncStorage } from 'react-native';
import { STATE, STATUS_PENDING, 
	STATUS_APPROVED, STATUS_REJECTED, STATUS_LIVE } from '../common/constants';

export function getPendingCount(items) {
	let count = 0;
	if(items!==undefined && items!==null && items.length>0) {
		items.forEach((item)=>{
			if(item.status === STATUS_PENDING) {
				count =count +1;
			}
		});
	}
	return count;
}

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
					if(ph.label==='mobile' || ph.label==='other'
						|| ph.label==='home'){
						phno = ph.number;
					}
				});
				if(phno !== undefined && phno !== null && phno!==0) {
				let phStr = trimNo(phno);
				let obj = {
						key:item.recordID,
						recordID:item.recordID,
						givenName: item.givenName,
						familyName: item.familyName,
						thumbnailPath: item.thumbnailPath,
						origNo:phno,
						phno:phStr,
						searchName: item.givenName + ' ' + item.familyName,
						selected: false
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
	output = output.substr(output.length - 10);
	return output;
}

export function mergedList(a1, a2) {
	let slist = [];
	try{
		if(a1!==undefined && a1!==null && a1.length>0) {
			let index = 0;
			let counter = -1;
			a1.forEach((item)=>{
				index++;
				if(item.recordID === a2.recordID){
					counter = index;
				}
			});
			if(counter>-1) {
				_.remove(a1, {recordID:a2.recordID});
			}
			a1 = [a2, ...a1];
		}
		else {
			a1 = [a2];
		}
		slist = [...a1];
	}
	catch(err) {
		console.log(err);
	}
    return slist; 
} 
export function updateStatus(items, data, contacts) {
	let itemList = [];
	try {
		let found = false;
		if(items!==undefined && items!==null && items.length>0) {
			items.forEach((item)=>{
				if(item.phno === data.from){
					item.status = data.status;
					found = true;
				}
			});
			if(found===true) {
				itemList = [...items];
			}
		}
		if(found==false) {
			let foundInContacts = false;
			contacts.forEach((contact)=>{
				if(contact.phno === data.from){
					let contactItem = contact;
					contactItem.status = data.status;
					items = [contactItem, ...items];
					foundInContacts = true;
				}
			});
			if(foundInContacts===false) {
				let selectectedContact = {
					recordID:data.from,
					givenName: data.from,
					familyName: '',
					thumbnailPath: '',
					phno:data.from,
					searchName: data.from,
					status: data.status
				};
				itemList = [selectectedContact, ...items];
			}
			else {
				itemList = [...items];
			}
		}
	}
	catch(err) {
		console.log(err);
	}
	return itemList;
}
export function updatePublish(items, contacts, data) {
	let itemList = [];
	let selectectedContact = {};
	try {
		if(contacts!==undefined && contacts!==null && contacts.length>0) {
			let exist = false;
			contacts.forEach((contact)=>{
				if(contact.phno === data.from){
					selectectedContact = contact;
					selectectedContact.status = data.status;
					exist = true;
				}
			});
			if(exist===false) {
				selectectedContact = {
					recordID:data.from,
					givenName: data.from,
					familyName: '',
					thumbnailPath: '',
					phno:data.from,
					searchName: data.from,
					status: data.status
				};
			}
			itemList = mergedList(items, selectectedContact);
		}
	}
	catch(err) {
		console.log(err);
	}
	return itemList;
}
export function updateSubLocations(items, obj) {
	let returnList = [];
	try {
		if(items!==undefined && items!==null && items.length>0) {
			let selecteditem = null;
			items.forEach((item)=>{
				if(item.phno === obj.from){
					item.loc = obj.data;
					item.status = STATUS_LIVE;
					selecteditem = item;
				}
			});
			_.remove(items, {recordID:selecteditem.recordID});
			returnList = [...items, selecteditem];
		}
	}
	catch(err) {
		console.log(err);
	}
	return returnList;
}
export function getStatus(s) {
	if(s !==undefined && s !== null && s !== '') {
		switch(s) {
			case STATUS_PENDING:
				return "Received";
			case STATUS_APPROVED: 
				return "Pending";
			case STATUS_LIVE: 
				return "Sharing";
			case STATUS_REJECTED:
				return "Offline";
		}
	}
	else {
		return '';
	}
}

export function removeContact(items, obj) {
	let returnList = [];
	_.remove(items, {phno:obj.from});
	returnList = [...items];
	return returnList;
}

export function removeItem(items, val) {
	let returnList = [];
	_.pull(items, val);
	returnList = [...items];
	return returnList;
}

export function addItem(items, val) {
	let returnList = [];
	_.pull(items, val);
	returnList = [...items, val];
	return returnList;
}

export function updateShareRequest(items, from) {
	let returnList = [];
	console.log(from);
	try {
		if(items!==undefined && items!==null && items.length>0) {
			items.forEach((item)=>{
				if(item.phno === from){
					item.shareRequested = true;
				}
			});
			returnList = [...items];
		}
	}
	catch(err) {
		console.log(err);
	}
	return returnList;
}

export function doneShareRequest(items, selectedLists) {
	let returnList = [];
	try {
		if(items!==undefined && items!==null && items.length>0) {
			if(selectedLists!==undefined && selectedLists!==null
				&& selectedLists.length>0) {
				selectedLists.forEach((sel)=>{
					items.forEach((item)=>{
						if(item.phno === sel){
							item.shareRequested = false;
						}
					});
				});
			}
			else {
				items.forEach((item)=>{
					item.shareRequested = false;
				});
			}
			returnList = [...items];
		}
	}
	catch(err) {
		console.log(err);
	}
	return returnList;
}