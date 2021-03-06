import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveDateOfBirth, addCredentialFromUrl, storeCredentials, addCredential, loadCredentials } from '../../../../../application/redux/actions/attributes';
import types from '../../../../../application/redux/actionTypes';

const mockStore = configureMockStore([thunk]);

describe('attribute action', () => {
  let store;
  const barcelonaResidencyAttribute = {
    predicate: 'schema:addressLocality',
    object: 'Barcelona',
    scope: 'can-access',
    provenance: {
      source: 'http://atlantis-decode.s3-website-eu-west-1.amazonaws.com',
      credentials: '0123456789',
    },
    subject: '(Alpaca)',
  };

  beforeEach(() => {
    store = mockStore({
      navigation: {
        currentNavigatorUID: 2,
      },
      attributes: {
        list: new Map(),
      },
    });
  });

  it('ADD Attribute action', () => {
    const attribute = {
      predicate: 'schema:addressLocality',
      object: 'Barcelona',
      scope: 'can-access',
      credentialIssuer: {
        url: 'http://atlantis-decode.s3-website-eu-west-1.amazonaws.com',
      },
    };
    const walletId = '(21323123123)';
    const url = 'exp://localhost:19000/+?credential=0123456789';


    const expectedActions = [{
      type: types.ADD_CREDENTIAL_FROM_URL,
      attribute,
      walletId,
      credential: '0123456789',
    }];

    store.dispatch(addCredentialFromUrl(attribute, walletId, url));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('SAVE current credentials action when no credentials in the state', async () => {
    store = mockStore({
      attributes: {
        list: new Map(),
      },
    });
    const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));

    await store.dispatch(storeCredentials(setItemAsync));

    expect(setItemAsync).toBeCalled();
    expect(setItemAsync).toBeCalledWith('attributes', '[]');

    expect(store.getActions()).toEqual([{
      type: types.STORE_ATTRIBUTES,
      attributes: new Map(),
    }]);
  });

  it('SAVE current credentials action when only one credential', async () => {
    store = mockStore({
      attributes: {
        list: new Map([[barcelonaResidencyAttribute.predicate, barcelonaResidencyAttribute]]),
      },
    });
    const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));

    await store.dispatch(storeCredentials(setItemAsync));

    expect(setItemAsync).toBeCalled();
    expect(setItemAsync).toBeCalledWith('attributes', JSON.stringify([barcelonaResidencyAttribute]));

    expect(store.getActions()).toEqual([{
      type: types.STORE_ATTRIBUTES,
      attributes: new Map([[barcelonaResidencyAttribute.predicate, barcelonaResidencyAttribute]]),
    }]);
  });

  it('addCredential when there is no credentials yet', async () => {
    store = mockStore({
      attributes: {
        list: new Map(),
      },
    });
    const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));
    const attribute = {
      predicate: 'schema:addressLocality',
      object: 'Barcelona',
      scope: 'can-access',
      provenance: {
        url: 'http://atlantis-decode.s3-website-eu-west-1.amazonaws.com',
      },
    };
    const walletId = '(21323123123)';
    const url = 'exp://localhost:19000/+?credential=0123456789';

    await store.dispatch(addCredential(attribute, walletId, url, setItemAsync));

    expect(setItemAsync).toBeCalled();
    expect(setItemAsync).toBeCalledWith('attributes', '[]');
    expect(store.getActions()).toEqual([
      {
        type: types.ADD_CREDENTIAL_FROM_URL,
        attribute,
        walletId,
        credential: '0123456789',
      }, {
        type: types.STORE_ATTRIBUTES,
        attributes: new Map(),
      },
    ]);
  });

  it('load credentials when nothing is stored', async () => {
    const credentials = [];
    const getItemAsync = jest.fn().mockReturnValue(Promise.resolve(JSON.stringify(credentials)));

    await store.dispatch(loadCredentials(getItemAsync));

    expect(getItemAsync).toBeCalled();
    expect(getItemAsync).toBeCalledWith('attributes');
    expect(store.getActions()).toEqual([{
      type: types.LOAD_ATTRIBUTES,
      attributes: new Map(),
    }]);
  });

  it('load credentials when one attribute is stored', async () => {
    const credentials = [barcelonaResidencyAttribute];
    const getItemAsync = jest.fn().mockReturnValue(Promise.resolve(JSON.stringify(credentials)));

    await store.dispatch(loadCredentials(getItemAsync));

    expect(getItemAsync).toBeCalled();
    expect(getItemAsync).toBeCalledWith('attributes');
    expect(store.getActions()).toEqual([{
      type: types.LOAD_ATTRIBUTES,
      attributes: new Map([
        [barcelonaResidencyAttribute.predicate, barcelonaResidencyAttribute],
      ]),
    }]);
  });

  describe('save date of birth', () => {
    const walletId = 42;
    const someDateOfBirth = '01/01/2000';

    it('should dispatch an action to save the optional attribute in the state', async () => {
      const setItemAsync = async () => {};
      const expectedAddAttributeAction = {
        type: types.ADD_OPTIONAL_ATTRIBUTE,
        attribute: {
          predicate: 'schema:dateOfBirth',
          object: someDateOfBirth,
          scope: 'can-access',
          provenance: {
            source: 'wallet',
          },
          subject: walletId,
        },
      };

      await store.dispatch(saveDateOfBirth(someDateOfBirth, walletId, setItemAsync));

      expect(store.getActions()[1]).toEqual(expectedAddAttributeAction);
    });

    it('should call save date of birth attribute to local storage action', async () => {
      const attributesList = new Map([
        ['schema:dateOfBirth', {
          predicate: 'schema:dateOfBirth',
          object: someDateOfBirth,
          scope: 'can-access',
          provenance: {
            source: 'wallet',
          },
          subject: walletId,
        }],
      ]);
      store = mockStore({
        attributes: {
          list: attributesList,
        },
        navigation: {
          currentNavigatorUID: 2,
        },
      });
      const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));
      const expectedStoreAttributesAction = {
        type: types.STORE_ATTRIBUTES,
        attributes: attributesList,
      };

      await store.dispatch(saveDateOfBirth(someDateOfBirth, walletId, setItemAsync));

      expect(setItemAsync).toBeCalled();
      expect(setItemAsync).toBeCalledWith('attributes', JSON.stringify([...attributesList.values()]));

      expect(store.getActions()[2]).toEqual(expectedStoreAttributesAction);
    });

    it('should navigate to the attribute landing page', async () => {
      const setItemAsync = async () => {};
      await store.dispatch(saveDateOfBirth(someDateOfBirth, walletId, setItemAsync));

      expect(store.getActions()[3].child.routeName).toEqual('attributesLanding');
    });

    it('should return a SAVE_DATE_OF_BIRTH action', async () => {
      const setItemAsync = async () => {};
      const expectedSaveDateOfBirthAction = {
        type: types.SAVE_DATE_OF_BIRTH,
        dateOfBirth: someDateOfBirth,
      };

      await store.dispatch(saveDateOfBirth(someDateOfBirth, walletId, setItemAsync));

      expect(store.getActions()[4]).toEqual(expectedSaveDateOfBirthAction);
    });

    it('should return a EMPTY_DATE_OF_BIRTH_ERROR action', async () => {
      const setItemAsync = async () => {};
      const expectedAction = {
        type: types.EMPTY_DATE_OF_BIRTH_ERROR,
      };

      await store.dispatch(saveDateOfBirth('', walletId, setItemAsync));

      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should return a SAVE_DATE_OF_BIRTH_ERROR action', async () => {
      const setItemAsync = async () => { throw new Error('Fake error'); };
      const expectedAction = {
        type: types.SAVE_DATE_OF_BIRTH_ERROR,
      };

      await store.dispatch(saveDateOfBirth(someDateOfBirth, walletId, setItemAsync));

      expect(store.getActions()[2]).toEqual(expectedAction);
    });

    it('should return a RESET_DATE_OF_BIRTH_ERRORS action', async () => {
      const setItemAsync = async () => {};
      const expectedAction = {
        type: types.RESET_DATE_OF_BIRTH_ERRORS,
      };

      await store.dispatch(saveDateOfBirth(someDateOfBirth, walletId, setItemAsync));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
});
