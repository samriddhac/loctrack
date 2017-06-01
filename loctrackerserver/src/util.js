module.exports = function(){
	return {
		isEmpty: function(o) {
			if(o!==undefined && o!==null) {
				return false;
			}
			return true;
		}
	}
}();