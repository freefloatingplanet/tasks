shortcut.add("Ctrl+Alt+i",function() {
    insertRow();
});

shortcut.add("Ctrl+Alt+d",function() {
    deleteRow();
});

shortcut.add("Ctrl+Alt+p",function() {
    copyRow();
});

// Ctrl+;
shortcut.add('Ctrl+Alt+k;',function() {
    setCurrentDate();
});
// Ctrl+:
shortcut.add('Ctrl+Alt+l',function() {
    setCurrentTime();
});