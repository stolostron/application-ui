(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('apollo-utilities')) :
	typeof define === 'function' && define.amd ? define(['exports', 'apollo-utilities'], factory) :
	(factory((global.graphqlAnywhere = {}),global.apollo.utilities));
}(this, (function (exports,apolloUtilities) { 'use strict';

/* Based on graphql function from graphql-js:
 *
 * graphql(
 *   schema: GraphQLSchema,
 *   requestString: string,
 *   rootValue?: ?any,
 *   contextValue?: ?any,
 *   variableValues?: ?{[key: string]: any},
 *   operationName?: ?string
 * ): Promise<GraphQLResult>
 *
 * The default export as of graphql-anywhere is sync as of 4.0,
 * but below is an exported alternative that is async.
 * In the 5.0 version, this will be the only export again
 * and it will be async
 *
 */
function graphql(resolver, document, rootValue, contextValue, variableValues, execOptions) {
    if (execOptions === void 0) { execOptions = {}; }
    var mainDefinition = apolloUtilities.getMainDefinition(document);
    var fragments = apolloUtilities.getFragmentDefinitions(document);
    var fragmentMap = apolloUtilities.createFragmentMap(fragments);
    var resultMapper = execOptions.resultMapper;
    // Default matcher always matches all fragments
    var fragmentMatcher = execOptions.fragmentMatcher || (function () { return true; });
    var execContext = {
        fragmentMap: fragmentMap,
        contextValue: contextValue,
        variableValues: variableValues,
        resultMapper: resultMapper,
        resolver: resolver,
        fragmentMatcher: fragmentMatcher,
    };
    return executeSelectionSet(mainDefinition.selectionSet, rootValue, execContext);
}
function executeSelectionSet(selectionSet, rootValue, execContext) {
    var fragmentMap = execContext.fragmentMap, contextValue = execContext.contextValue, variables = execContext.variableValues;
    var result = {};
    selectionSet.selections.forEach(function (selection) {
        if (!apolloUtilities.shouldInclude(selection, variables)) {
            // Skip this entirely
            return;
        }
        if (apolloUtilities.isField(selection)) {
            var fieldResult = executeField(selection, rootValue, execContext);
            var resultFieldKey = apolloUtilities.resultKeyNameFromField(selection);
            if (fieldResult !== undefined) {
                if (result[resultFieldKey] === undefined) {
                    result[resultFieldKey] = fieldResult;
                }
                else {
                    merge(result[resultFieldKey], fieldResult);
                }
            }
        }
        else {
            var fragment = void 0;
            if (apolloUtilities.isInlineFragment(selection)) {
                fragment = selection;
            }
            else {
                // This is a named fragment
                fragment = fragmentMap[selection.name.value];
                if (!fragment) {
                    throw new Error("No fragment named " + selection.name.value);
                }
            }
            var typeCondition = fragment.typeCondition.name.value;
            if (execContext.fragmentMatcher(rootValue, typeCondition, contextValue)) {
                var fragmentResult = executeSelectionSet(fragment.selectionSet, rootValue, execContext);
                merge(result, fragmentResult);
            }
        }
    });
    if (execContext.resultMapper) {
        return execContext.resultMapper(result, rootValue);
    }
    return result;
}
function executeField(field, rootValue, execContext) {
    var variables = execContext.variableValues, contextValue = execContext.contextValue, resolver = execContext.resolver;
    var fieldName = field.name.value;
    var args = apolloUtilities.argumentsObjectFromField(field, variables);
    var info = {
        isLeaf: !field.selectionSet,
        resultKey: apolloUtilities.resultKeyNameFromField(field),
        directives: apolloUtilities.getDirectiveInfoFromField(field, variables),
    };
    var result = resolver(fieldName, rootValue, args, contextValue, info);
    // Handle all scalar types here
    if (!field.selectionSet) {
        return result;
    }
    // From here down, the field has a selection set, which means it's trying to
    // query a GraphQLObjectType
    if (result == null) {
        // Basically any field in a GraphQL response can be null, or missing
        return result;
    }
    if (Array.isArray(result)) {
        return executeSubSelectedArray(field, result, execContext);
    }
    // Returned value is an object, and the query has a sub-selection. Recurse.
    return executeSelectionSet(field.selectionSet, result, execContext);
}
function executeSubSelectedArray(field, result, execContext) {
    return result.map(function (item) {
        // null value in array
        if (item === null) {
            return null;
        }
        // This is a nested array, recurse
        if (Array.isArray(item)) {
            return executeSubSelectedArray(field, item, execContext);
        }
        // This is an object, run the selection set on it
        return executeSelectionSet(field.selectionSet, item, execContext);
    });
}
function merge(dest, src) {
    if (src === null || typeof src !== 'object') {
        // These types just override whatever was in dest
        return src;
    }
    // Merge sub-objects
    Object.keys(dest).forEach(function (destKey) {
        if (src.hasOwnProperty(destKey)) {
            merge(dest[destKey], src[destKey]);
        }
    });
    // Add props only on src
    Object.keys(src).forEach(function (srcKey) {
        if (!dest.hasOwnProperty(srcKey)) {
            dest[srcKey] = src[srcKey];
        }
    });
}

function filter(doc, data) {
    var resolver = function (fieldName, root, args, context, info) {
        return root[info.resultKey];
    };
    return graphql(resolver, doc, data);
}
// TODO: we should probably make check call propType and then throw,
// rather than the other way round, to avoid constructing stack traces
// for things like oneOf uses in React. At this stage I doubt many people
// are using this like that, but in the future, who knows?
function check(doc, data) {
    var resolver = function (fieldName, root, args, context, info) {
        if (!{}.hasOwnProperty.call(root, info.resultKey)) {
            throw new Error(info.resultKey + " missing on " + root);
        }
        return root[info.resultKey];
    };
    graphql(resolver, doc, data, {}, {}, {
        fragmentMatcher: function () { return false; },
    });
}
// Lifted/adapted from
//   https://github.com/facebook/react/blob/master/src/isomorphic/classic/types/ReactPropTypes.js
var ANONYMOUS = '<<anonymous>>';
function PropTypeError(message) {
    this.message = message;
    this.stack = '';
}
// Make `instanceof Error` still work for returned errors.
PropTypeError.prototype = Error.prototype;
var reactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context',
};
function createChainableTypeChecker(validate) {
    function checkType(isRequired, props, propName, componentName, location, propFullName) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
        if (props[propName] == null) {
            var locationName = reactPropTypeLocationNames[location];
            if (isRequired) {
                if (props[propName] === null) {
                    return new PropTypeError("The " + locationName + " `" + propFullName + "` is marked as required " +
                        ("in `" + componentName + "`, but its value is `null`."));
                }
                return new PropTypeError("The " + locationName + " `" + propFullName + "` is marked as required in " +
                    ("`" + componentName + "`, but its value is `undefined`."));
            }
            return null;
        }
        else {
            return validate(props, propName, componentName, location, propFullName);
        }
    }
    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
}
function propType(doc) {
    return createChainableTypeChecker(function (props, propName) {
        var prop = props[propName];
        try {
            if (!prop.loading) {
                check(doc, prop);
            }
            return null;
        }
        catch (e) {
            // Need a much better error.
            // Also we aren't checking for extra fields
            return e;
        }
    });
}

exports.default = graphql;
exports.filter = filter;
exports.check = check;
exports.propType = propType;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
