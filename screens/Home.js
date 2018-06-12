import React from 'react';
import { connect } from 'react-redux';
import { Image, Text, TextInput, View } from 'react-native';
import { SecureStore } from 'expo';
import PropTypes from 'prop-types';
import { goQRScannerIntro, goToPetitionSummary } from '../application/redux/actions/navigation';
import { onStartApp } from '../application/redux/actions/petitionLink';
import { loadCredentials } from '../application/redux/actions/attributes';
import { getWalletId } from '../application/redux/actions/wallet';
import authorizationAction, { updatePin } from '../application/redux/actions/authorization';
import { storePinOnAppInitalization } from '../LocalStorage';
import Button from '../application/components/Button/Button';


import styles from './styles';

const decodeLogo = require('../assets/images/decode_logo.jpg');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.goToNextPage = this.goToNextPage.bind(this);
  }

  componentWillMount() {
    this.props.initializeState().then(() => {});
  }

  goToNextPage() {
    return this.props.doAuthorize(this.props.pinCode).then((action) => {
      if (action.pinCorrect) {
        if (this.props.petitionLink) {
          this.props.goToPetitionSummary(this.props.petitionLink);
        } else {
          this.props.goQRScannerIntro();
        }
      } else {
        alert('Incorrect pin code'); // eslint-disable-line
      }
    });
  }

  render() {
    return (
      <View style={styles.homeContainer}>
        <Image
          style={styles.homeLogo}
          source={decodeLogo}
        />
        <Text style={styles.homeWelcomeMessage}>Welcome, Jane Doe</Text>
        <View style={styles.homeTextInput}>
          <TextInput
            style={styles.homePassword}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="rgb(0,163,158)"
            onChangeText={pin => this.props.updatePin(pin)}
            value={this.props.pinCode}
          />
        </View>
        <Button name="LOG IN" onPress={this.goToNextPage} />
      </View>
    );
  }
}

Home.propTypes = {
  goQRScannerIntro: PropTypes.func.isRequired,
  goToPetitionSummary: PropTypes.func.isRequired,
  initializeState: PropTypes.func.isRequired,
  doAuthorize: PropTypes.func.isRequired,
  updatePin: PropTypes.func.isRequired,
  petitionLink: PropTypes.string,
  pinCode: PropTypes.string,
};

Home.defaultProps = {
  petitionLink: undefined,
  pinCode: '',
};

const mapStateToProps = state => ({
  petitionLink: state.petitionLink.petitionLink,
  pinCode: state.authorization.pin,
});

const mapDispatchToProps = dispatch => ({
  goQRScannerIntro: () => { dispatch(goQRScannerIntro()); },
  goToPetitionSummary: (petitionLink) => { dispatch(goToPetitionSummary(petitionLink)); },
  doAuthorize: pin => dispatch(authorizationAction(pin, SecureStore.getItemAsync)),
  updatePin: (pin) => { dispatch(updatePin(pin)); },
  initializeState: async () => {
    await dispatch(onStartApp());
    await dispatch(getWalletId());
    await storePinOnAppInitalization(SecureStore.setItemAsync);
    await dispatch(loadCredentials(SecureStore.getItemAsync));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

