import app from "./app.js"
import connectdb from "./db/index.js"

const PORT = process.env.PORT || 8000
let server;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});

async function startServer() {
    try {
        await connectdb();
        console.log('Database connected successfully');

        server = app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION! Shutting down...');
            console.error(err.name, err.message);
            
            // Graceful shutdown
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle SIGTERM
        process.on('SIGTERM', () => {
            console.log('SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('Process terminated!');
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();