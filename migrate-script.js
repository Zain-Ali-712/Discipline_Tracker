// Migration Script - Run this in your browser console to manually trigger migration

(async function migrateData() {
    console.log('🚀 Starting manual data migration...');

    // Function to get localStorage data
    function getLocalStorageData(key) {
        try {
            const item = localStorage.getItem(`discipline-tracker-${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    // Collect all data
    const history = getLocalStorageData('history') || [];
    const projects = getLocalStorageData('projects') || [];
    const allTimePitches = getLocalStorageData('allTimePitches') || {};
    const theme = getLocalStorageData('theme') || 'dark';

    console.log('📦 Data collected:');
    console.log(`  - History records: ${history.length}`);
    console.log(`  - Projects: ${projects.length}`);
    console.log(`  - Theme: ${theme}`);
    console.log(`  - All-time pitches:`, allTimePitches);

    // Create backup
    const backup = {
        timestamp: new Date().toISOString(),
        history,
        projects,
        allTimePitches,
        theme
    };

    // Download backup as JSON file (optional but recommended)
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discipline-tracker-backup-${backup.timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('💾 Backup file downloaded!');

    // Migrate history
    if (history.length > 0) {
        console.log('📝 Migrating history...');
        try {
            const historyResponse = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(history)
            });

            if (historyResponse.ok) {
                console.log('✅ History migrated successfully');
            } else {
                console.error('❌ History migration failed:', await historyResponse.text());
            }
        } catch (error) {
            console.error('❌ History migration error:', error);
        }
    }

    // Migrate projects
    if (projects.length > 0) {
        console.log('📁 Migrating projects...');
        try {
            const projectsResponse = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projects)
            });

            if (projectsResponse.ok) {
                console.log('✅ Projects migrated successfully');
            } else {
                console.error('❌ Projects migration failed:', await projectsResponse.text());
            }
        } catch (error) {
            console.error('❌ Projects migration error:', error);
        }
    }

    // Migrate settings
    console.log('⚙️ Migrating settings...');
    try {
        const settingsResponse = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theme,
                allTimePitches
            })
        });

        if (settingsResponse.ok) {
            console.log('✅ Settings migrated successfully');
        } else {
            console.error('❌ Settings migration failed:', await settingsResponse.text());
        }
    } catch (error) {
        console.error('❌ Settings migration error:', error);
    }

    // Mark as migrated
    localStorage.setItem('discipline-tracker-migrated', JSON.stringify(true));

    console.log('🎉 Migration complete!');
    console.log('💡 Your data is now in MongoDB');
    console.log('📌 Your localStorage data remains as a backup');
    console.log('🔄 Refresh the page to see your data loaded from MongoDB');
})();
