var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export * from 'apollo-client';
export * from 'apollo-link';
export * from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
export { gql, HttpLink };
var PRESET_CONFIG_KEYS = [
    'request',
    'uri',
    'credentials',
    'headers',
    'fetch',
    'fetchOptions',
    'clientState',
    'onError',
    'cacheRedirects',
    'cache',
];
var DefaultClient = (function (_super) {
    __extends(DefaultClient, _super);
    function DefaultClient(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        if (config) {
            var diff = Object.keys(config).filter(function (key) { return PRESET_CONFIG_KEYS.indexOf(key) === -1; });
            if (diff.length > 0) {
                console.warn('ApolloBoost was initialized with unsupported options: ' +
                    ("" + diff.join(' ')));
            }
        }
        var request = config.request, uri = config.uri, credentials = config.credentials, headers = config.headers, fetch = config.fetch, fetchOptions = config.fetchOptions, clientState = config.clientState, cacheRedirects = config.cacheRedirects, errorCallback = config.onError;
        var cache = config.cache;
        if (cache && cacheRedirects) {
            throw new Error('Incompatible cache configuration. If providing `cache` then ' +
                'configure the provided instance with `cacheRedirects` instead.');
        }
        if (!cache) {
            cache = cacheRedirects
                ? new InMemoryCache({ cacheRedirects: cacheRedirects })
                : new InMemoryCache();
        }
        var stateLink = clientState
            ? withClientState(__assign({}, clientState, { cache: cache }))
            : false;
        var errorLink = errorCallback
            ? onError(errorCallback)
            : onError(function (_a) {
                var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError;
                if (graphQLErrors) {
                    graphQLErrors.map(function (_a) {
                        var message = _a.message, locations = _a.locations, path = _a.path;
                        return console.log("[GraphQL error]: Message: " + message + ", Location: " +
                            (locations + ", Path: " + path));
                    });
                }
                if (networkError) {
                    console.log("[Network error]: " + networkError);
                }
            });
        var requestHandler = request
            ? new ApolloLink(function (operation, forward) {
                return new Observable(function (observer) {
                    var handle;
                    Promise.resolve(operation)
                        .then(function (oper) { return request(oper); })
                        .then(function () {
                        handle = forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        });
                    })
                        .catch(observer.error.bind(observer));
                    return function () {
                        if (handle) {
                            handle.unsubscribe();
                        }
                    };
                });
            })
            : false;
        var httpLink = new HttpLink({
            uri: uri || '/graphql',
            fetch: fetch,
            fetchOptions: fetchOptions || {},
            credentials: credentials || 'same-origin',
            headers: headers || {},
        });
        var link = ApolloLink.from([
            errorLink,
            requestHandler,
            stateLink,
            httpLink,
        ].filter(function (x) { return !!x; }));
        _this = _super.call(this, { cache: cache, link: link }) || this;
        return _this;
    }
    return DefaultClient;
}(ApolloClient));
export default DefaultClient;
//# sourceMappingURL=index.js.map