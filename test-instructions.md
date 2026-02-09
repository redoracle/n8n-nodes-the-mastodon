# Testing Your Mastodon n8n Plugin Locally

You now have a packaged version of your plugin: `n8n-nodes-the-mastodon-0.0.1.tgz`

## Method 1: Local Development with Custom Nodes Directory (Recommended)

```bash
# Build and package the plugin
cd ./n8n-nodes-the-mastodon && npm run build
npm pack

# Copy package to n8n custom nodes directory
cp n8n-nodes-the-mastodon-0.0.1.tgz $HOME/.n8n/custom
cd $HOME/.n8n/custom

# Clean up any existing package and extract new one
rm -rf package
tar xzvf n8n-nodes-the-mastodon-0.0.1.tgz

# Start n8n
n8n start
```

## Method 2: Install in Global n8n

```bash
# Install the package globally in n8n
npm install -g ./n8n-nodes-the-mastodon/n8n-nodes-the-mastodon-0.0.1.tgz

# Start n8n
npx n8n
```

## Method 3: Use with n8n Docker

```bash
# Create a directory for custom nodes
mkdir -p ~/.n8n/custom

# Extract your package to the custom nodes directory
cd ~/.n8n/custom
tar -xzf ./n8n-nodes-the-mastodon/n8n-nodes-the-mastodon-0.0.1.tgz

# Run n8n with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

## Method 4: Development Environment with n8n Source

```bash
# Clone n8n repository
git clone https://github.com/n8n-io/n8n.git
cd n8n

# Install dependencies
npm install

# Link your package
npm link ./n8n-nodes-the-mastodon

# Start in development mode
npm run dev
```

## Method 5: Local Development Server

```bash
# In your plugin directory, start a file watcher
npm run build:watch

# In another terminal, install the package and restart n8n when changes occur
# This requires manual restarts but gives you faster iteration
```

## Testing Your Plugin

1. **Start n8n** using one of the methods above
2. **Open** <http://localhost:5678> in your browser
3. **Create a new workflow**
4. **Search for "Mastodon"** in the nodes panel
5. **Add the Mastodon node** to your workflow

## Setting Up Credentials

1. **Create Mastodon OAuth2 Credentials**:
   - Go to your Mastodon instance (e.g., <https://mastodon.social>)
   - Go to Settings > Development > New Application
   - Set the redirect URI to match n8n's OAuth callback
   - Copy the Client ID and Client Secret

2. **Configure in n8n**:
   - Add new credentials of type "Mastodon OAuth2 API"
   - Enter your Mastodon instance URL
   - Enter Client ID and Client Secret
   - Complete the OAuth flow

## Testing Operations

Try these operations to verify everything works:

1. **Status Operations**:
   - Create a status
   - View a status
   - Get status context (test the new feature!)

2. **Account Operations**:
   - View user profile
   - Verify credentials
   - Search accounts

3. **Timeline Operations**:
   - Get public timeline
   - Get home timeline

## Debugging

If you encounter issues:

1. **Check n8n logs** for error messages
2. **Verify the plugin was loaded** by looking for "Mastodon" in the nodes list
3. **Check credentials** are properly configured
4. **Test API endpoints** manually to ensure they work

## Hot Reloading for Development

For faster development, you can:

1. Use `npm run build:watch` to automatically rebuild on changes
2. Restart n8n after each build to load the new version
3. Use n8n's development mode if working with the source

Your plugin includes comprehensive status context functionality with multiple return formats and proper API compliance!
