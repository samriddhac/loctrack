import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  defaultFont: {
    fontWeight: 'bold',
    fontFamily: 'notoserif'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4A44F2',
  },
  headerContent: {
    flexDirection: 'row',
    flex:1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerIconBtn: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  headerIcon: {
    width:40,
    color:'#ffffff'
  },
  headerIconThreeDots: {
    justifyContent:'flex-end',
    paddingLeft:10
  },
  headerIconSearch: {
    justifyContent:'flex-start'
  },
  headerText: {
    flex:3,
    paddingLeft: 10,
    fontSize: 20,
    color: '#ffffff'
  },
  homeContainer : {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  content: {
    flex: 11
  },
  searchBoxContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  searchTextBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  searchBack: {
    color: '#4A44F2',
    flex: 1
  },
  TextInputStyle: {
    flex:7,
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#4A44F2',
    fontSize: 20,
    marginRight:10
  },
  searchResultContainer: {
    flex: 9,
    paddingTop: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    elevation:2,
    backgroundColor: '#ffffff',
  },
  thumb:{
    width:40,
    height:40,
    borderRadius: 40
  },
  rowText: {
    marginLeft: 10,
    fontSize: 20
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  contactContainer:{
    flex:7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  addButton: {
    flex:1,
    backgroundColor:'#4A44F2',
    justifyContent:'space-around',
    alignItems: 'center',
    width:50,
    height:50,
    borderRadius:50
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  }
});
export default styles;