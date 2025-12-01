#!/usr/bin/env python3
"""
Add Set label nodes to Mastodon test workflow to properly name each test in results.
"""
import json
import sys


def add_label_nodes(workflow_file):
    with open(workflow_file, "r") as f:
        workflow = json.load(f)

    # Node names for all 36 test nodes
    test_nodes = [
        "1. Verify Credentials",
        "2. Create Status",
        "3. View Status",
        "4. Edit Status",
        "5. Get Context",
        "6. Add Bookmark",
        "7. Get Bookmarks",
        "8. Remove Bookmark",
        "9. Favourite Status",
        "10. Get Favourites",
        "11. Unfavourite Status",
        "12. Create List",
        "13. Get Lists",
        "14. Get List",
        "15. Update List",
        "16. Delete List",
        "17. Get Home Timeline",
        "18. Get Public Timeline",
        "19. Get Hashtag Timeline",
        "20. Search",
        "21. Get Notifications",
        "22. Search Accounts",
        "23. Get Server Info",
        "24. Get Preferences",
        "25. Get Custom Emojis",
        "26. View Directory",
        "27. Get Follow Requests",
        "28. Get Endorsements",
        "29. Get Conversations",
        "30. Get Featured Tags",
        "31. Get Mutes",
        "32. Get Domain Blocks",
        "33. Get Announcements",
        "34. Get Filters",
        "35. Get Suggestions",
        "36. Delete Status (Cleanup)",
    ]

    # Find all test nodes and their IDs
    test_node_map = {}
    for node in workflow["nodes"]:
        if node["name"] in test_nodes:
            test_node_map[node["name"]] = node["id"]

    # Create label nodes
    label_nodes = []
    for test_name in test_nodes:
        if test_name not in test_node_map:
            continue

        node_id = test_node_map[test_name]
        label_node = {
            "parameters": {
                "assignments": {
                    "assignments": [
                        {
                            "id": "test_name_id",
                            "name": "test_name",
                            "value": test_name,
                            "type": "string",
                        }
                    ]
                },
                "options": {},
            },
            "type": "n8n-nodes-base.set",
            "typeVersion": 3.3,
            "position": [0, 0],  # Will be set based on original node position
            "id": f"label-{node_id}",
            "name": f"Label: {test_name}",
        }
        label_nodes.append(label_node)

    # Insert label nodes before Collect Test Results node
    collect_results_index = next(
        i
        for i, node in enumerate(workflow["nodes"])
        if node["name"] == "Collect Test Results"
    )

    # Insert all label nodes
    for label_node in reversed(label_nodes):
        workflow["nodes"].insert(collect_results_index, label_node)

    # Update connections
    new_connections = {}

    for node_name, connections in workflow["connections"].items():
        # If this is a test node that should connect to its label
        if node_name in test_nodes:
            label_name = f"Label: {node_name}"
            # Redirect connection to label node
            new_connections[node_name] = {
                "main": [[{"node": label_name, "type": "main", "index": 0}]]
            }
            # Label node connects to Collect Test Results
            new_connections[label_name] = {
                "main": [[{"node": "Collect Test Results", "type": "main", "index": 0}]]
            }
        # For non-test nodes or special cases, keep original connections
        else:
            # Check if any connection points to Collect Test Results from a test node
            if "main" in connections:
                for conn_array in connections["main"]:
                    for conn in conn_array:
                        # If test node was connecting to Collect Test Results,
                        # that's now handled by the label node
                        if (
                            conn["node"] == "Collect Test Results"
                            and node_name in test_nodes
                        ):
                            continue
            new_connections[node_name] = connections

    # Handle special cases: nodes in a chain should still connect to next node
    # Node 1 -> Label 1 (done)
    # Node 2 -> Node 3 AND Node 9 AND Label 2
    new_connections["2. Create Status"] = {
        "main": [
            [
                {"node": "3. View Status", "type": "main", "index": 0},
                {"node": "9. Favourite Status", "type": "main", "index": 0},
                {"node": "Label: 2. Create Status", "type": "main", "index": 0},
            ]
        ]
    }

    # Nodes 3-8 chain, each adds label connection
    chains = [
        ("3. View Status", "4. Edit Status"),
        ("4. Edit Status", "5. Get Context"),
        ("5. Get Context", "6. Add Bookmark"),
        ("6. Add Bookmark", "7. Get Bookmarks"),
        ("7. Get Bookmarks", "8. Remove Bookmark"),
        ("8. Remove Bookmark", "36. Delete Status (Cleanup)"),
    ]

    for from_node, to_node in chains:
        new_connections[from_node] = {
            "main": [
                [
                    {"node": to_node, "type": "main", "index": 0},
                    {"node": f"Label: {from_node}", "type": "main", "index": 0},
                ]
            ]
        }

    # Node 9-11 favourites chain
    new_connections["9. Favourite Status"] = {
        "main": [
            [
                {"node": "10. Get Favourites", "type": "main", "index": 0},
                {"node": "Label: 9. Favourite Status", "type": "main", "index": 0},
            ]
        ]
    }
    new_connections["10. Get Favourites"] = {
        "main": [
            [
                {"node": "11. Unfavourite Status", "type": "main", "index": 0},
                {"node": "Label: 10. Get Favourites", "type": "main", "index": 0},
            ]
        ]
    }
    new_connections["11. Unfavourite Status"] = {
        "main": [
            [
                {"node": "12. Create List", "type": "main", "index": 0},
                {"node": "Label: 11. Unfavourite Status", "type": "main", "index": 0},
            ]
        ]
    }

    # Node 12-16 lists chain
    lists_chain = [
        ("12. Create List", "13. Get Lists"),
        ("13. Get Lists", "14. Get List"),
        ("14. Get List", "15. Update List"),
        ("15. Update List", "16. Delete List"),
    ]

    for from_node, to_node in lists_chain:
        new_connections[from_node] = {
            "main": [
                [
                    {"node": to_node, "type": "main", "index": 0},
                    {"node": f"Label: {from_node}", "type": "main", "index": 0},
                ]
            ]
        }

    # Node 16 ends chain
    new_connections["16. Delete List"] = {
        "main": [[{"node": "Label: 16. Delete List", "type": "main", "index": 0}]]
    }

    # Node 36 ends status cleanup chain
    new_connections["36. Delete Status (Cleanup)"] = {
        "main": [
            [{"node": "Label: 36. Delete Status (Cleanup)", "type": "main", "index": 0}]
        ]
    }

    # All standalone nodes (17-35, excluding those in chains above)
    standalone_nodes = [
        "17. Get Home Timeline",
        "18. Get Public Timeline",
        "19. Get Hashtag Timeline",
        "20. Search",
        "21. Get Notifications",
        "22. Search Accounts",
        "23. Get Server Info",
        "24. Get Preferences",
        "25. Get Custom Emojis",
        "26. View Directory",
        "27. Get Follow Requests",
        "28. Get Endorsements",
        "29. Get Conversations",
        "30. Get Featured Tags",
        "31. Get Mutes",
        "32. Get Domain Blocks",
        "33. Get Announcements",
        "34. Get Filters",
        "35. Get Suggestions",
    ]

    for node_name in standalone_nodes:
        new_connections[node_name] = {
            "main": [[{"node": f"Label: {node_name}", "type": "main", "index": 0}]]
        }

    workflow["connections"] = new_connections

    # Save updated workflow
    with open(workflow_file, "w") as f:
        json.dump(workflow, f, indent="\t")

    print(f"✅ Added {len(label_nodes)} label nodes to workflow")
    print(f"✅ Updated connections for proper test naming")


if __name__ == "__main__":
    workflow_file = (
        sys.argv[1] if len(sys.argv) > 1 else "Comprehensive_Mastodon_Test.json"
    )
    add_label_nodes(workflow_file)
