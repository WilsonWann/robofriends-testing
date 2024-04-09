import * as type from './constants'
import * as actions from './actions'

import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

import fetchMock from 'fetch-mock';

const mockStore = configureMockStore([thunkMiddleware])

it('should create an action to search robots', () => {
  const text = 'wooo'
  const expectedAction = {
    type: type.CHANGE_SEARCHFIELD,
    payload: text
  }
  expect(actions.setSearchField(text)).toEqual(expectedAction)
})

describe('Fetch robots action PENDING', () => {

  afterEach(() => {
    fetchMock.restore();
  });
  it("should create a Pending action on request Robots", () => {
    fetchMock.getOnce('https://jsonplaceholder.typicode.com/users', {
      body: { users: [] },
      headers: { 'content-type': 'application/json' }
    });
    const expectedActions = [{ type: REQUEST_ROBOTS_PENDING }];
    const store = mockStore()
    store.dispatch(actions.requestRobots()).then(() => {
      const action = store.getActions()
      expect(action[0]).toEqual(expectedActions[0])
    })
  })

  it('should create a Success action on request Robots', async () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    fetchMock.getOnce('https://jsonplaceholder.typicode.com/users', {
      body: mockData,
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: REQUEST_ROBOTS_PENDING },
      { type: REQUEST_ROBOTS_SUCCESS, payload: mockData }
    ];
    const store = mockStore({});

    return store.dispatch(requestRobots()).then(() => {
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  })

  it('should create a Failed action on request Robots', async () => {
    const error = 'API call failed';
    fetchMock.getOnce('https://jsonplaceholder.typicode.com/users', {
      throws: error,
    });

    const expectedActions = [
      { type: REQUEST_ROBOTS_PENDING },
      { type: REQUEST_ROBOTS_FAILED, payload: error }
    ];
    const store = mockStore({});

    return store.dispatch(requestRobots()).then(() => {
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    })

  })
})
