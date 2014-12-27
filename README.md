biojs-vis-iann-3d-globe

Interactive 3D Globe for happening events around the world

NOTE: Please Check with browsers if not working on Chrome, maybe Apple Safari or Firefox.
If still not working, then follow below steps:
1. Open Command tool and navigate to javascript folder inside the project.
    $cd biojs-vis-iann-3d-globe/javascript/

2. Run follow command:
    $python -m SimpleHTTPServer 8888 &
OR
    You can also try running the project using other server modules like npm.

3. Open your browser at localhost:8888. You should be able to see the project working with 3D Globe.

Features:

Globe rotating manually via drag event, when mouse click event fires - transition begins. For transition backwards use double click on any country. In this, we make transition a simple path to path (shortest way) and map always cut along anti-meridian line.



