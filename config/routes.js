/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    'POST /account/login': 'account/login',
    'POST /account/signup': 'account/signup',
    // 'POST /share/borrower': 'share/borrower-info',
    'POST /share/apply': 'share/application'
};
