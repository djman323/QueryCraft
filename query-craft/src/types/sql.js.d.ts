declare module 'sql.js' {
    export interface Database {
        run(sql: string): void;
        exec(sql: string): QueryExecResult[];
        export(): Uint8Array;
        close(): void;
        getRowsModified(): number;
    }

    export interface QueryExecResult {
        columns: string[];
        values: any[][];
    }

    export interface SqlJsStatic {
        Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
    }

    export interface Config {
        locateFile?: (filename: string) => string;
    }

    export default function initSqlJs(config?: Config): Promise<SqlJsStatic>;
}
