import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'column'
  },
  headerContent: {
    height: 45,
    flexDirection: 'row',
  },
  headerIcon: {
    width: 36,
    margin:5,
    height: 36,
  },
  headerText: {
    width:50,
    fontSize: 12,
    color: 'red',
    textAlign: 'justify',
    fontStyle: 'italic',
    justifyContent: 'center',
    marginTop:5
  }

});
export default styles;