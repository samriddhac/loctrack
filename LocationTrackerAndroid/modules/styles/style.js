import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerContent: {
    flexDirection: 'row'
  },
  headerIcon: {
    paddingLeft: 5,
    maxWidth: 60,
    maxHeight: 60
  },
  headerText: {
    paddingTop: 8,
    paddingLeft: 5,
    fontSize: 16,
    color: 'red',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: 'sans-serif-condensed'
  },
  settings: {
    paddingRight: 5
  },
  content: {
    flex: 9
  },
  searchContainer : {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderWidth: 1
  },
  searchBox: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderWidth: 1
  },
  searchResult: {
    flex: 8,
    borderWidth: 1
  }
});
export default styles;