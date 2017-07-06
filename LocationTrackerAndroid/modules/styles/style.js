import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  center: {
    flex: 1
  },
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
    paddingLeft:5,
    paddingRight:10
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
  tabBarContent: {
    backgroundColor: '#4A44F2'
  },
  indicatorStyle:{
    backgroundColor: '#ffffff'
  },
  labelStyle: {
    fontFamily: 'notoserif'
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
  rowSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
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
    flex:2,
    backgroundColor:'#ffffff',
    color: '#4A44F2',
    justifyContent: 'center',
    alignItems: 'center',
    width:35,
    height:35,
    borderRadius:35,
    paddingRight: 2,
    paddingTop: 2
  },
  subButton: {
    flex:2,
    backgroundColor:'#ffffff',
    color: '#4A44F2',
    justifyContent: 'center',
    alignItems: 'center',
    width:35,
    height:35,
    borderRadius:35
  },
  stopButton: {
    flex:1,
    paddingRight:4,
    backgroundColor:'#ffffff',
    color: '#CC1D23',
    alignItems: 'center'
  },
  stopButtonSingle: {
    flex:1,
    flexDirection: 'row',
    paddingRight:4,
    backgroundColor:'#ffffff',
    color: '#CC1D23',
    justifyContent:'flex-end',
    alignItems: 'center'
  },
  stopButtonSingleX: {
    flex:1,
    flexDirection: 'row',
    paddingRight:2,
    backgroundColor:'#ffffff',
    color: '#CC1D23',
    justifyContent:'flex-end',
    alignItems: 'center'
  },
  mapButton: {
    flex:1,
    paddingRight:6,
    backgroundColor:'#ffffff',
    color: '#CC1D23'
  },
  checkButton: {
    flex:1,
    paddingRight:0,
    backgroundColor:'#ffffff',
    color: '#215602'
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
    width:45,
    height:45,
    borderRadius:45,
    alignItems: 'center'
  },
  mapBackButton: {
    paddingRight:5,
    color: '#4A44F2'
  },
  globalmapButtonContainer: {
    backgroundColor:'#CC1D23',
    width:45,
    height:45,
    borderRadius:45,
    alignItems: 'center',
    marginRight:10
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
  },
  searchIconContainer: {
    backgroundColor: 'transparent',
    width: 26,
    height: 26,
    borderRadius: 26
  },
  backContainer: {
    backgroundColor: 'transparent',
    width: 44,
    height: 44,
    borderRadius: 44
  },
  pubsubButtonContainer: {
    backgroundColor: 'transparent',
    width: 36,
    height: 36,
    borderRadius: 36,
    paddingLeft:5,
    paddingRight:5
  },
  subRightContainer: {
    flex: 3
  },
  subRightBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 4
  },
  subRightStopBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1.5
  },
  subRightContainerX: {
    flex: 1.5
  },
  subRightStopBtnContainerX: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1
  },
  statusText: {
    color: 'blue'
  },
  statusTextContainer: {
    flex:1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  globalShareButtonContainer: {
    backgroundColor:'#215602',
    width:45,
    height:45,
    borderRadius:45,
    alignItems: 'center',
    marginRight:20
  },
  globalShareBackButton: {
    paddingTop:5,
    paddingRight:0,
    color: '#ffffff'
  },
  globalStopButtonContainer: {
    backgroundColor:'#CC1D23',
    width:45,
    height:45,
    borderRadius:45,
    alignItems: 'center',
    marginRight:10
  },
  globalStopButton: {
    paddingTop:5,
    paddingRight:0,
    color: '#ffffff'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  plainView: {
    width: 60,
  },
  listViewContainer: {
    flex: 9
  },
  globalButtonContainer: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight:10
  },
  selected: {
    backgroundColor: '#d6d5f2'
  },
  unselected: {
    backgroundColor: '#ffffff'
  },
  countText: {
    fontSize: 20,
    marginLeft: 20,
    fontFamily: 'notoserif',
    paddingBottom: 10
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 60,
    width: "100%",
    backgroundColor: '#ffffff'
  },
  bottombarBtn: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width:140,
    height:40,
    borderRadius:30,
    margin: 10,
    paddingTop:10
  },
  violet: {
    backgroundColor: '#4A44F2'
  },
  green: {
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderColor: '#4A44F2'
  },
  bottomText: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'notoserif',
    fontSize: 12
  },
  bottomTextWhite: {
    color: '#ffffff'
  },
  bottomTextBlue: {
    color: '#4A44F2'
  },
  globalmapButtonTxtContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  btnBottomText: {
    color: '#4A44F2',
    fontFamily: 'notoserif',
    fontSize: 12, 
    alignItems: 'center',
    marginRight:20
  },
  globalShareButtonTxtContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  globalStopButtonTxtContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pubBtnTxtStyle: {
    color: '#4A44F2',
    fontFamily: 'notoserif',
    fontSize: 12
  },
  optionStyles: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 30
  },
  menuOptionTextStyle: {
    fontFamily: 'notoserif',
    fontSize: 20,
    paddingLeft: 25
  },
  selectedPubBtnContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 3,
    left:30,
    width:20,
    height:20,
    borderRadius:20,
    backgroundColor: '#ffffff'
  },
  selectedPubBtn: {
    color: '#215602',
    backgroundColor:'#ffffff',
    width:20,
    height:20,
    borderRadius:20
  }
});
export default styles;