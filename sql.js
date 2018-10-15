const sql = require("msnodesqlv8");

const connectionString = "server=.;Database=Master;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

var query =
        `SELECT [ModifiedDate]
        ,[BusinessEntityID]
        ,[OrganizationNode]
        ,[ModifiedDate]
        FROM [scratch].[dbo].[Employee]
        WHERE BusinessEntityID = ?`;
 
    // open connection
    sql.open(connStr, function (err, conn) {
        assert.ifError(err);
        // prepare a statement which can be re-used
        conn.prepare(query, function (e, ps) {
            // called back with a prepared statement
            console.log(ps.getMeta());
            // prepared query meta data avaialble to view
            assert.ifError(err);
            // execute with expected paramater
            ps.preparedQuery([1], function(err, fetched) {
                console.log(fetched);
                // can call again with new parameters.
                // note - free the statement when no longer used,
                // else resources will be leaked.
                ps.free(function() {
                    done();
                })
            });
        });
    });