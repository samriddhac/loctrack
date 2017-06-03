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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBack: {
    color: '#4A44F2',
    flex: 1
  },
  TextInputStyle: {
    flex:7,
    alignItems: 'stretch',
    fontSize: 20,
    marginRight:10,
    fontFamily: 'notoserif',
    height: 44,
    paddingHorizontal: 10,
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
    backgroundColor: '#ffffff',
  },
  thumb:{
    width:50,
    height:50,
    borderRadius: 50
  },
  rowText: {
    marginLeft: 10,
    fontSize: 16
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
  pubButton: {
    flex:1,
    backgroundColor:'#ffffff',
    color: '#4A44F2',
    alignItems: 'center',
    width:40,
    height:40,
    borderRadius:40
  },
  subButton: {
    flex:1,
    paddingLeft:6,
    backgroundColor:'#ffffff',
    color: '#4A44F2',
    alignItems: 'center',
    width:40,
    height:40,
    borderRadius:40
  },
  stopButton: {
    flex:1,
    paddingLeft:6,
    backgroundColor:'#ffffff',
    color: '#CC1D23',
    alignItems: 'center',
    width:40,
    height:40,
    borderRadius:40
  },
  mapButton: {
    flex:1,
    paddingRight:6,
    backgroundColor:'#ffffff',
    color: '#CC1D23'
  },
  mapContainer: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapButtonContainer: {
    position: 'absolute',
    top: 30,
    left: 30,
    backgroundColor:'#4A44F2',
    opacity:0.4,
    width:40,
    height:40,
    borderRadius:40,
    alignItems: 'center'
  },
  mapBackButton: {
    paddingRight:5,
    color: '#4A44F2'
  },
  globalmapButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor:'#CC1D23',
    width:55,
    height:55,
    borderRadius:55,
    alignItems: 'center'
  },
  globalmapBackButton: {
    paddingTop:5,
    paddingRight:5,
    color: '#ffffff'
  },
  mylocMarker: {
    width: 20,
    height: 20
  },
  registerContainer: {
    flex:8,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  TextInputStyleReg: {
    alignItems: 'stretch',
    fontSize: 20,
    margin:10,
    fontFamily: 'notoserif',
    height: 44,
    paddingHorizontal: 10
  },
  regItems: {
    alignItems: 'stretch'
  },
  regItemsButton: {
    alignItems: 'center'
  },
  welcomeStyle: {
    padding:20,
    fontFamily: 'notoserif',
    color: '#4A44F2'
  },
  regItemsTextInput: {
    alignItems: 'stretch'
  },
  roundBtn: {
    borderRadius: 10
  }
});
export default styles;