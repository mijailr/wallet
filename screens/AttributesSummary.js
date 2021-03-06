import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Constants, SecureStore, WebBrowser } from 'expo';
import { Linking, View, Text, Image, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { goToPetitionSummary } from '../application/redux/actions/navigation';
import Button from '../application/components/Button/Button';
import { addCredential } from '../application/redux/actions/attributes';
import openPetitionInBrowser from '../application/utils';
import styles from './styles';
import i18n from '../i18n';

const decodeUser = require('../assets/images/decode-user.png');

const backToPetitionInBrowser = (petitionId) => {
  const petitionUrl = `http://secure-petitions.s3-website-eu-west-1.amazonaws.com/#/${petitionId}`;
  Linking.openURL(petitionUrl);
};

class AttributesSummary extends React.Component {
  static route = {
    navigationBar: {
      backgroundColor: 'white',
      fontSize: 20,
      fontWeight: '500',
      tintColor: 'rgb(0,163,158)',
      title: 'Verify your Information',
      renderLeft: (router) => {
        console.log();
        return (
          <TouchableOpacity onPress={() => backToPetitionInBrowser(router.params.petitionId)}>
            <Text>Back to Decidim</Text>
          </TouchableOpacity>
        );
      },
    },
  };

  handleRedirect = async (event) => {
    const { url } = event;
    const { petition, walletId } = this.props;
    await this.props.addCredential(petition.attributes.mandatory[0], walletId, url);
    await this.props.goToPetitionSummary();
    WebBrowser.dismissBrowser();
  };

  openWebBrowserAsync = async () => {
    const queryParam = encodeURIComponent(Constants.linkingUri);
    const url = `http://atlantis-decode.s3-website-eu-west-1.amazonaws.com/#/?linkingUri=${queryParam}`;

    Linking.addEventListener('url', this.handleRedirect);
    await WebBrowser.openBrowserAsync(url);
    Linking.removeEventListener('url', this.handleRedirect);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#13A398', flex: 1.5 }}>
          <Image
            style={{
              height: 100,
              alignSelf: 'center',
              resizeMode: 'contain',
              marginVertical: 20,
            }}
            source={decodeUser}
          />
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            }}
          >
            Isabella Dominguez
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#13A398',
            margin: 16,
            marginTop: 30,
            fontSize: 20,
          }}
          >
            {this.props.petition.title}
          </Text>
          <Text style={{
            color: '#3E393C',
            fontWeight: '900',
            fontSize: 13,
            marginLeft: 16,
          }}
          >
            {this.props.t('title')}
          </Text>
          <Text style={{
            color: '#3E393C',
            fontWeight: '100',
            fontSize: 13,
            marginLeft: 16,
            marginTop: 8,
          }}
          >
            {this.props.t('subtitle')}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Button
            name={this.props.t('button')}
            onPress={this.openWebBrowserAsync}
            style={{
              marginTop: 40,
              alignSelf: 'center',
              width: 250,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={styles.cancelSigningPetition}
            onPress={() => openPetitionInBrowser(this.props.petition.id)}
          >{this.props.t('cancel')}
          </Text>
        </View>
      </View>
    );
  }
}

AttributesSummary.propTypes = {
  petition: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    closingDate: PropTypes.string,
  }),
  goToPetitionSummary: PropTypes.func.isRequired,
  addCredential: PropTypes.func.isRequired,
  walletId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

AttributesSummary.defaultProps = {
  petition: undefined,
};

const mapStateToProps = state => ({
  petition: state.petition.petition,
  walletId: state.wallet.id,
});

const mapDispatchToProps = dispatch => ({
  goToPetitionSummary: () => { dispatch(goToPetitionSummary()); },
  addCredential: (attribute, walletId, url) => {
    dispatch(addCredential(attribute, walletId, url, SecureStore.setItemAsync));
  },
});

export default translate('attributesSummary', { i18n })(connect(mapStateToProps, mapDispatchToProps)(AttributesSummary));
