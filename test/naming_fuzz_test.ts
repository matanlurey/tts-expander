import { ObjectState } from '@matanlurey/tts-save-format/src/types';
import * as fs from 'fs-extra';
import path from 'path';
import { nameObject } from '../src';

const samples = fs.readJsonSync(path.join('samples', 'names.json')) as {
  names: string[];
  nickNames: string[];
};

test('should be able to name a common list of names', () => {
  expect(
    '\n' +
      samples.names
        .map((n) => {
          return ({
            GUID: 12345,
            Name: n,
            Nickname: '',
          } as unknown) as ObjectState;
        })
        .map((o) => {
          return `${o.Name.padEnd(50)}: ${nameObject(o)}`;
        })
        .join('\n'),
  ).toMatchInlineSnapshot(`
    "
    ScriptingTrigger                                  : ScriptingTrigger.12345
    Custom_Model                                      : Custom_Model.12345
    Counter                                           : Counter.12345
    BlockSquare                                       : BlockSquare.12345
    BlockRectangle                                    : BlockRectangle.12345
    Custom_Assetbundle                                : Custom_Assetbundle.12345
    Custom_Model_Bag                                  : Custom_Model_Bag.12345
    Custom_Token                                      : Custom_Token.12345
    Notecard                                          : Notecard.12345
    Card                                              : Card.12345
    Custom_Model_Stack                                : Custom_Model_Stack.12345
    Deck                                              : Deck.12345
    Infinite_Bag                                      : Infinite_Bag.12345
    Bag                                               : Bag.12345
    Tablet                                            : Tablet.12345
    Tileset_Rock                                      : Tileset_Rock.12345
    Custom_Tile                                       : Custom_Tile.12345
    BlockTriangle                                     : BlockTriangle.12345
    Digital_Clock                                     : Digital_Clock.12345
    ChipStack                                         : ChipStack.12345
    Chip_50                                           : Chip_50.12345
    Chess_Rook                                        : Chess_Rook.12345
    Die_6_Rounded                                     : Die_6_Rounded.12345
    Die_6                                             : Die_6.12345
    Chess_Queen                                       : Chess_Queen.12345
    CardCustom                                        : CardCustom.12345
    Custom_Model_Infinite_Bag                         : Custom_Model_Infinite_Bag.12345
    Custom_Dice                                       : Custom_Dice.12345
    Custom_PDF                                        : Custom_PDF.12345"
  `);
});

test('should be able to name a common list of names', () => {
  expect(
    '\n' +
      samples.nickNames
        .map((n) => {
          return ({
            GUID: 12345,
            Name: 'Irrelevant',
            Nickname: n,
          } as unknown) as ObjectState;
        })
        .map((o) => {
          return `${o.Nickname.padEnd(50)}: ${nameObject(o)}`;
        })
        .join('\n'),
  ).toMatchInlineSnapshot(`
    "
    Model Template A                                  : Model_Template_A.12345
    Model Template B                                  : Model_Template_B.12345
    Red Army Point Cost                               : Red_Army_Point_Cost.12345
                                                      : Irrelevant.12345
    Black Attack Dice Red                             : Black_Attack_Dice_Red.12345
    Clear Die Red                                     : Clear_Die_Red.12345
    Red Attack Die Red                                : Red_Attack_Die_Red.12345
    Roll Die Red                                      : Roll_Die_Red.12345
    White Defense Dice Red                            : White_Defense_Dice_Red.12345
    Red Defense Dice Red                              : Red_Defense_Dice_Red.12345
    Red Attack Die Blue                               : Red_Attack_Die_Blue.12345
    Roll Die Blue                                     : Roll_Die_Blue.12345
    Black Attack Dice Blue                            : Black_Attack_Dice_Blue.12345
    Red Defense Dice Blue                             : Red_Defense_Dice_Blue.12345
    White Defense Dice Blue                           : White_Defense_Dice_Blue.12345
    White Attack Dice Blue                            : White_Attack_Dice_Blue.12345
    Clear Die Blue                                    : Clear_Die_Blue.12345
    White Attack Dice Red                             : White_Attack_Dice_Red.12345
    Red List Builder Back Button                      : Red_List_Builder_Back_Button.12345
    Red List Builder Option 1                         : Red_List_Builder_Option_1.12345
    Red List Builder Option 2 Button                  : Red_List_Builder_Option_2_Button.12345
    Red List Builder Option 3 Button                  : Red_List_Builder_Option_3_Button.12345
    RED LIST BUILDER                                  : RED_LIST_BUILDER.12345
    Data Disk                                         : Data_Disk.12345
    Red List Builder Option 2                         : Red_List_Builder_Option_2.12345
    Red List Builder Option 3                         : Red_List_Builder_Option_3.12345
    Blue List Builder Option 1                        : Blue_List_Builder_Option_1.12345
    Blue List Builder Option 2 Button                 : Blue_List_Builder_Option_2_Button.12345
    BLUE LIST BUILDER                                 : BLUE_LIST_BUILDER.12345
    Blue List Builder Option 2                        : Blue_List_Builder_Option_2.12345
    Blue List Builder Option 3                        : Blue_List_Builder_Option_3.12345
    Blue List Builder Option 3 Button                 : Blue_List_Builder_Option_3_Button.12345
    Blue List Builder Back Button                     : Blue_List_Builder_Back_Button.12345
    Game Controller Option 1 Button                   : Game_Controller_Option_1_Button.12345
    Game Controller Option 2 Button                   : Game_Controller_Option_2_Button.12345
    Game Controller Option 3 Button                   : Game_Controller_Option_3_Button.12345
    Game Controller Back Button                       : Game_Controller_Back_Button.12345
    Data Cartridge                                    : Data_Cartridge.12345
    Game Controller Option 4 Button                   : Game_Controller_Option_4_Button.12345
    Game Controller Option 5 Button                   : Game_Controller_Option_5_Button.12345
    Return Tokens Button                              : Return_Tokens_Button.12345
    Remove Suppression Button                         : Remove_Suppression_Button.12345
    Standard Maps                                     : Standard_Maps.12345
    Scarif Supply Depot                               : Scarif_Supply_Depot.12345
    Large Crate [Heavy Cover]                         : Large_Crate_Heavy_Cover.12345
    Tide Pool [No Cover]                              : Tide_Pool_No_Cover.12345
    Barricade [Heavy Cover]                           : Barricade_Heavy_Cover.12345
    Comms Building (Lower)[Heavy Cover]               : Comms_Building_Lower_Heavy_Cover.12345
    Bunker [Heavy Cover]                              : Bunker_Heavy_Cover.12345
    Jungle [Light Cover][Area Terrain]                : Jungle_Light_Cover_Area_Terrain.12345
    Cargo Pallet [Light Cover]                        : Cargo_Pallet_Light_Cover.12345
    BATTLEFIELD                                       : BATTLEFIELD.12345
    Rock Formation [Heavy Cover]                      : Rock_Formation_Heavy_Cover.12345
    Tall Grass [Light Cover][Area Terrain]            : Tall_Grass_Light_Cover_Area_Terrain.12345
    Fallen Trunk [Light Cover]                        : Fallen_Trunk_Light_Cover.12345
    Ladder [Light Cover]                              : Ladder_Light_Cover.12345
    Small Cliff w/ Jungle [Heavy Cover][Area Terrain] : Small_Cliff_w_Jungle_Heavy_Cover_Area_Terrain.12345
    Arsenal [Heavy Cover]                             : Arsenal_Heavy_Cover.12345
    Comms Building (Upper)[Heavy Cover]               : Comms_Building_Upper_Heavy_Cover.12345
    Kessel Storage Yard                               : Kessel_Storage_Yard.12345
    Pond [No Cover]                                   : Pond_No_Cover.12345
    Cargo Crates [Light Cover]                        : Cargo_Crates_Light_Cover.12345
    Machinery [Heavy Cover]                           : Machinery_Heavy_Cover.12345
    Chem Silo [Heavy Cover]                           : Chem_Silo_Heavy_Cover.12345
    Small Cliff [Heavy Cover]                         : Small_Cliff_Heavy_Cover.12345
    Walkway [Light Cover]                             : Walkway_Light_Cover.12345
    Platform [Light Cover]                            : Platform_Light_Cover.12345
    Platform [Light/Heavy Cover]                      : Platform_Light_Heavy_Cover.12345
    Sand Mound [Light Cover]                          : Sand_Mound_Light_Cover.12345
    Chimney Vent [Heavy Cover]                        : Chimney_Vent_Heavy_Cover.12345
    Starkiller Base Outpost                           : Starkiller_Base_Outpost.12345
    Small Cliff w/ Woods [Heavy Cover]                : Small_Cliff_w_Woods_Heavy_Cover.12345
    Redwood Tree [Heavy Cover]                        : Redwood_Tree_Heavy_Cover.12345
    Sparse Woods [Light Cover][Area Terrain]          : Sparse_Woods_Light_Cover_Area_Terrain.12345
    Sandbags [Light Cover]                            : Sandbags_Light_Cover.12345
    Dense Woods [Heavy Cover][Area Terrain]           : Dense_Woods_Heavy_Cover_Area_Terrain.12345
    Comms Building [Heavy Cover]                      : Comms_Building_Heavy_Cover.12345
    Yellow Light Spheres 2\\"-20\\"                       : Yellow_Light_Spheres_2_-20.12345
    Wall [Heavy Cover]                                : Wall_Heavy_Cover.12345
    Control Tower [Heavy Cover]                       : Control_Tower_Heavy_Cover.12345
    Water Tower [Light Cover]                         : Water_Tower_Light_Cover.12345
    Mechanics House [Heavy Cover]                     : Mechanics_House_Heavy_Cover.12345
    Warehouse [Heavy Cover]                           : Warehouse_Heavy_Cover.12345
    Lah'mu Farming Factory                            : Lah_mu_Farming_Factory.12345
    Fuel Tank [Heavy Cover]                           : Fuel_Tank_Heavy_Cover.12345
    Moisture Vaporator [Light Cover]                  : Moisture_Vaporator_Light_Cover.12345
    Building [Heavy Cover]                            : Building_Heavy_Cover.12345
    Cargo Crates [Heavy Cover]                        : Cargo_Crates_Heavy_Cover.12345
    Ящик                                              : Ящик.12345
    Corellia Fuel Yard                                : Corellia_Fuel_Yard.12345
    Rubble Mound [Light Cover]                        : Rubble_Mound_Light_Cover.12345
    Doorway [Heavy Cover]                             : Doorway_Heavy_Cover.12345
    Landing Bay Wall [Heavy Cover]                    : Landing_Bay_Wall_Heavy_Cover.12345
    Garrison [Heavy Cover]                            : Garrison_Heavy_Cover.12345
    Fuel Storage Cell [Heavy Cover]                   : Fuel_Storage_Cell_Heavy_Cover.12345
    Refinery Processor [Heavy Cover]                  : Refinery_Processor_Heavy_Cover.12345
    Holo Ad [Light Cover]                             : Holo_Ad_Light_Cover.12345
    Bespin Gardens                                    : Bespin_Gardens.12345
    Bench [Heavy Cover]                               : Bench_Heavy_Cover.12345
    Bespin Wall (High Stone Wall) [Heavy Cover]       : Bespin_Wall_High_Stone_Wall_Heavy_Cover.12345
    Small Park (Area Terrain) [Light Cover]           : Small_Park_Area_Terrain_Light_Cover.12345
    Bespin Office [Heavy Cover]                       : Bespin_Office_Heavy_Cover.12345
    Small Park [Light Cover]                          : Small_Park_Light_Cover.12345
    Plant Divider [Heavy Cover]                       : Plant_Divider_Heavy_Cover.12345
    Imperial Hangar                                   : Imperial_Hangar.12345
    TIE Fighter [Heavy Cover]                         : TIE_Fighter_Heavy_Cover.12345
    Desk [Light Cover]                                : Desk_Light_Cover.12345
    Large Cargo Container [Heavy Cover]               : Large_Cargo_Container_Heavy_Cover.12345
    Box [Light Cover]                                 : Box_Light_Cover.12345
    Cargo Pallet [Light Cover Area Terrain]           : Cargo_Pallet_Light_Cover_Area_Terrain.12345
    Desk Light Cover                                  : Desk_Light_Cover.12345
    Stairs [Light Cover]                              : Stairs_Light_Cover.12345
    Terminal [Light Cover]                            : Terminal_Light_Cover.12345
    PILLAR [Does not block LOS or Movement]           : PILLAR_Does_not_block_LOS_or_Movement.12345
    PILLAR                                            : PILLAR.12345
    WALL [Does not block LOS or Movement]             : WALL_Does_not_block_LOS_or_Movement.12345
    Crate Pile                                        : Crate_Pile.12345
    Crate Pile [Heavy Cover]                          : Crate_Pile_Heavy_Cover.12345
    Jedha City Center                                 : Jedha_City_Center.12345
    Rubble (No Cover)                                 : Rubble_No_Cover.12345
    Bridge Walkway [Heavy Cover]                      : Bridge_Walkway_Heavy_Cover.12345
    T-65 X-Wing [Light/Heavy Cover]                   : T-65_X-Wing_Light_Heavy_Cover.12345
    Stairs [Heavy Cover]                              : Stairs_Heavy_Cover.12345
    Stairs Wall [Heavy Cover]                         : Stairs_Wall_Heavy_Cover.12345
    Landing Bay Loading Door [Heavy Cover]            : Landing_Bay_Loading_Door_Heavy_Cover.12345
    Urban Dwelling [Heavy Cover]                      : Urban_Dwelling_Heavy_Cover.12345
    Small Hill [Light Cover]                          : Small_Hill_Light_Cover.12345
    Landing Bay Archway [Heavy Cover]                 : Landing_Bay_Archway_Heavy_Cover.12345
    Ruins [Light Cover]                               : Ruins_Light_Cover.12345
    Tower [Heavy Cover]                               : Tower_Heavy_Cover.12345
    Urban Dwelling (Building) [Heavy Cover]           : Urban_Dwelling_Building_Heavy_Cover.12345
    Shrine Wall [Heavy Cover]                         : Shrine_Wall_Heavy_Cover.12345
    Forest Moon Supply Outpost                        : Forest_Moon_Supply_Outpost.12345
    Sparse Woods [Light Cover]                        : Sparse_Woods_Light_Cover.12345
    Cargo Pallet [Heavy Cover]                        : Cargo_Pallet_Heavy_Cover.12345
    Dense  [Heavy Cover][Area Terrain]                : Dense_Heavy_Cover_Area_Terrain.12345
    Guard Tower (Building) [Heavy Cover]              : Guard_Tower_Building_Heavy_Cover.12345
    Dense Woods [Heavy Cover]                         : Dense_Woods_Heavy_Cover.12345
    Redwood Tree [Light Cover]                        : Redwood_Tree_Light_Cover.12345
    Endor Supply Post                                 : Endor_Supply_Post.12345
    Kessel Spice Mines                                : Kessel_Spice_Mines.12345
    Starkiller Base Outskirts                         : Starkiller_Base_Outskirts.12345
    Shield Generator (Building) [Heavy Cover]         : Shield_Generator_Building_Heavy_Cover.12345
    Guard Tower [Heavy Cover]                         : Guard_Tower_Heavy_Cover.12345
    Tree [Light Cover]                                : Tree_Light_Cover.12345
    Lah'Mu Farms                                      : Lah_Mu_Farms.12345
    Stream [No Cover]                                 : Stream_No_Cover.12345
    Small Desert House [Heavy Cover]                  : Small_Desert_House_Heavy_Cover.12345
    Bridge [Heavy Cover]                              : Bridge_Heavy_Cover.12345
    Small Cliff [Light Cover]                         : Small_Cliff_Light_Cover.12345
    Lava Mound [Light Cover]                          : Lava_Mound_Light_Cover.12345
    Mustafar Mini Operation                           : Mustafar_Mini_Operation.12345
    Less Smoke                                        : Less_Smoke.12345
    Laser Tower (Building) [Heavy Cover]              : Laser_Tower_Building_Heavy_Cover.12345
    Lava River [No Cover]                             : Lava_River_No_Cover.12345
    smoking Lava Mound [Light Cover][Area Terrain]    : smoking_Lava_Mound_Light_Cover_Area_Terrain.12345
    Lava Mound [Light Cover][Area Terrain]            : Lava_Mound_Light_Cover_Area_Terrain.12345
    Landing Bay Wall (High Stone Wall) [Heavy Cover]  : Landing_Bay_Wall_High_Stone_Wall_Heavy_Cover.12345
    Mechanics House (Building) [Heavy Cover]          : Mechanics_House_Building_Heavy_Cover.12345
    Tower (Building) [Heavy Cover]                    : Tower_Building_Heavy_Cover.12345
    Corellia Factory Outpost                          : Corellia_Factory_Outpost.12345
    Platform 2nd Floor [Light/Heavy Cover]            : Platform_2nd_Floor_Light_Heavy_Cover.12345
    Platform 3rd Floor [Light Cover]                  : Platform_3rd_Floor_Light_Cover.12345
    Platform 1st Floor [Light/Heavy Cover]            : Platform_1st_Floor_Light_Heavy_Cover.12345
    Landing Platform                                  : Landing_Platform.12345
    Platform 2nd Floor [Light Cover]                  : Platform_2nd_Floor_Light_Cover.12345
    Platform 1st Floor [Light Cover]                  : Platform_1st_Floor_Light_Cover.12345
    Kashyyyk Jungle                                   : Kashyyyk_Jungle.12345
    River (Shallow Water) [No Cover]                  : River_Shallow_Water_No_Cover.12345
    Kashyyyk Tree House [Heavy Cover]                 : Kashyyyk_Tree_House_Heavy_Cover.12345
    Rock  [Heavy Cover]                               : Rock_Heavy_Cover.12345
    Hoth Perimeter Camp                               : Hoth_Perimeter_Camp.12345
    Walkway Barrier [Light Cover]                     : Walkway_Barrier_Light_Cover.12345
    Ice Mound (Blast Hole) [Light Cover]              : Ice_Mound_Blast_Hole_Light_Cover.12345
    Shack (Building) [Heavy Cover]                    : Shack_Building_Heavy_Cover.12345
    Walkway Barrier [Heavy Cover]                     : Walkway_Barrier_Heavy_Cover.12345
    Endor Forest Bunker                               : Endor_Forest_Bunker.12345
    Stream (Shallow Water) [No Cover]                 : Stream_Shallow_Water_No_Cover.12345
    Large Cliff with Dense Woods [Heavy Cover]        : Large_Cliff_with_Dense_Woods_Heavy_Cover.12345
    Walkway Ramp [No Cover]                           : Walkway_Ramp_No_Cover.12345
    Large Cliff [Heavy Cover]                         : Large_Cliff_Heavy_Cover.12345
    Small Cliff with Dense Woods [Heavy Cover]        : Small_Cliff_with_Dense_Woods_Heavy_Cover.12345
    Jedha Town Square                                 : Jedha_Town_Square.12345
    Balcony lvl 2 [Heavy Cover]                       : Balcony_lvl_2_Heavy_Cover.12345
    Balcony lvl 1 [Heavy Cover]                       : Balcony_lvl_1_Heavy_Cover.12345
    Desert Tower (Building) [Heavy Cover]             : Desert_Tower_Building_Heavy_Cover.12345
    Sand Mound (Blast Hole) [Light Cover]             : Sand_Mound_Blast_Hole_Light_Cover.12345
    Mud [No Cover]                                    : Mud_No_Cover.12345
    Jedi Statue [Heavy Cover]                         : Jedi_Statue_Heavy_Cover.12345
    Bespin Plaza                                      : Bespin_Plaza.12345
    Vader's Landing Bay                               : Vader_s_Landing_Bay.12345
    Mechanics House(Building) [Heavy Cover]           : Mechanics_House_Building_Heavy_Cover.12345
    Lava Mound (Blast Hole) [Light Cover]             : Lava_Mound_Blast_Hole_Light_Cover.12345
    Lambda-Class Shuttle [Heavy Cover]                : Lambda-Class_Shuttle_Heavy_Cover.12345
    Tarkin Town (Lothal)                              : Tarkin_Town_Lothal.12345
    Mimban Camp Forward                               : Mimban_Camp_Forward.12345
    Trench Holdout [Heavy Cover]                      : Trench_Holdout_Heavy_Cover.12345
    Trench [Heavy Cover]                              : Trench_Heavy_Cover.12345
    Fuel Unit [Heavy Cover]                           : Fuel_Unit_Heavy_Cover.12345
    Coruscant Port                                    : Coruscant_Port.12345
    Comms Building lvl 1 (Building) [Heavy Cover]     : Comms_Building_lvl_1_Building_Heavy_Cover.12345
    Debris Mound (Blast Hole) [Light Cover]           : Debris_Mound_Blast_Hole_Light_Cover.12345
    Doorway (High Stone Wall) [Heavy Cover]           : Doorway_High_Stone_Wall_Heavy_Cover.12345
    Garrison lvl 2 (Building) [Heavy Cover]           : Garrison_lvl_2_Building_Heavy_Cover.12345
    Garrison lvl 1 (Building) [Heavy Cover]           : Garrison_lvl_1_Building_Heavy_Cover.12345
    Lothal City                                       : Lothal_City.12345
    Kachirho Beach (Kashyyyk)                         : Kachirho_Beach_Kashyyyk.12345
    Destroyed LAAT Gunship [Heavy Cover]              : Destroyed_LAAT_Gunship_Heavy_Cover.12345
    Rocks [Heavy Cover]                               : Rocks_Heavy_Cover.12345
    Mimban Trenches                                   : Mimban_Trenches.12345
    Coruscant Streets                                 : Coruscant_Streets.12345
    Garrison (Building) [Heavy Cover]                 : Garrison_Building_Heavy_Cover.12345
    Spotlight (all colors)                            : Spotlight_all_colors.12345
    Comms Building lvl 2 (Building) [Heavy Cover]     : Comms_Building_lvl_2_Building_Heavy_Cover.12345
    Yavin Hideout                                     : Yavin_Hideout.12345
    Mos Eisley Alleyways                              : Mos_Eisley_Alleyways.12345
    Small Desert House (Building) [Heavy Cover]       : Small_Desert_House_Building_Heavy_Cover.12345
    Hoth Rebel Outpost                                : Hoth_Rebel_Outpost.12345
    Hill [Heavy Cover]                                : Hill_Heavy_Cover.12345
    Endor River Crossing                              : Endor_River_Crossing.12345
    Shallow Water [No Cover]                          : Shallow_Water_No_Cover.12345
    Scarif Landing                                    : Scarif_Landing.12345
    Destroyed Outpost Gate                            : Destroyed_Outpost_Gate.12345
    Scarif Map Notes                                  : Scarif_Map_Notes.12345
    Outpost Wall Lvl 2 (High Stone Wall) [Heavy Cover]: Outpost_Wall_Lvl_2_High_Stone_Wall_Heavy_Cover.12345
    Outpost Wall Lvl 1 (High Stone Wall) [Heavy Cover]: Outpost_Wall_Lvl_1_High_Stone_Wall_Heavy_Cover.12345
    Sullust Refinery                                  : Sullust_Refinery.12345
    Update 2.05                                       : Update_2.05.12345
    Lava [No Cover]                                   : Lava_No_Cover.12345
    Outpost Gate (Barrier) [Heavy Cover]              : Outpost_Gate_Barrier_Heavy_Cover.12345
    Outpost Wall (High Stone Wall) [Heavy Cover]      : Outpost_Wall_High_Stone_Wall_Heavy_Cover.12345
    Mos Eisley Crash                                  : Mos_Eisley_Crash.12345
    Sand Pile [Light Cover]                           : Sand_Pile_Light_Cover.12345
    Crashed YT-1300 [Heavy Cover]                     : Crashed_YT-1300_Heavy_Cover.12345
    Hoth Fortress                                     : Hoth_Fortress.12345
    Outpost Gate                                      : Outpost_Gate.12345
    Custom Maps                                       : Custom_Maps.12345
    Custom Texture                                    : Custom_Texture.12345
    Battlefield Editor                                : Battlefield_Editor.12345
    Pit [No Cover]                                    : Pit_No_Cover.12345
    WALL                                              : WALL.12345
    Volcano                                           : Volcano.12345
    Desert                                            : Desert.12345
    Desert 2                                          : Desert_2.12345
    Snow                                              : Snow.12345
    Jungle                                            : Jungle.12345
    Mud                                               : Mud.12345
    City 1                                            : City_1.12345
    City 2                                            : City_2.12345
    Beach                                             : Beach.12345
    Game Controller Previous Button                   : Game_Controller_Previous_Button.12345
    Game Controller Next Button                       : Game_Controller_Next_Button.12345
    Tournament Maps                                   : Tournament_Maps.12345
    Dathomir                                          : Dathomir.12345
    Bushland [Light Cover Area]                       : Bushland_Light_Cover_Area.12345
    Witch Tree [Heavy Cover]                          : Witch_Tree_Heavy_Cover.12345
    Slums Shack [Light Cover]                         : Slums_Shack_Light_Cover.12345
    Pavilion [Heavy Cover Area]                       : Pavilion_Heavy_Cover_Area.12345
    Barricade [Heavy cover]                           : Barricade_Heavy_cover.12345
    Slums Walkway [Light Cover]                       : Slums_Walkway_Light_Cover.12345
    Small Camp [Light Cover]                          : Small_Camp_Light_Cover.12345
    Barricade Wall [Heavy Cover]                      : Barricade_Wall_Heavy_Cover.12345
    Hoth - \\"Kay One Zero\\"                             : Hoth_-_Kay_One_Zero.12345
    Shield Generator [Heavy Cover]                    : Shield_Generator_Heavy_Cover.12345
    Crashed T-47 [Heavy Cover](Area Terrain)          : Crashed_T-47_Heavy_Cover_Area_Terrain.12345
    Cargo Crates [Light  Cover]                       : Cargo_Crates_Light_Cover.12345
    Blast Crater[Light Cover](Area Terrain)           : Blast_Crater_Light_Cover_Area_Terrain.12345
    DF.9 Turret [Heavy Cover]                         : DF.9_Turret_Heavy_Cover.12345
    Blast Crater [Light Cover](Area Terrain)          : Blast_Crater_Light_Cover_Area_Terrain.12345
    Comms Array [Light Cover]                         : Comms_Array_Light_Cover.12345
    Ryloth - \\"Liberation of Nabat\\"                    : Ryloth_-_Liberation_of_Nabat.12345
    Dense Woods [Heavy Cover](Area Terrain)           : Dense_Woods_Heavy_Cover_Area_Terrain.12345
    Blast Crater [Light Cover]                        : Blast_Crater_Light_Cover.12345
    Outpost Wall [Heavy Cover]                        : Outpost_Wall_Heavy_Cover.12345
    Small Home [Heavy Cover]                          : Small_Home_Heavy_Cover.12345
    Small Shop [Heavy Cover]                          : Small_Shop_Heavy_Cover.12345
    Outpost Gate [Heavy Cover]                        : Outpost_Gate_Heavy_Cover.12345
    Crashed LAAT Gunship [Heavy Cover]                : Crashed_LAAT_Gunship_Heavy_Cover.12345
    Special Note                                      : Special_Note.12345
    Tatooine - \\"Scum & Villainy\\"                      : Tatooine_-_Scum_&_Villainy.12345
    Medium Desert House [Heavy Cover]                 : Medium_Desert_House_Heavy_Cover.12345
    Double Desert Arch [Heavy Cover]                  : Double_Desert_Arch_Heavy_Cover.12345
     Tall Desert Wall [Heavy Cover]                   : Tall_Desert_Wall_Heavy_Cover.12345
    Short Desert Wall [Heavy Cover]                   : Short_Desert_Wall_Heavy_Cover.12345
    Small Desert Arch [Heavy Cover]                   : Small_Desert_Arch_Heavy_Cover.12345
    Desert Shop [Heavy Cover]                         : Desert_Shop_Heavy_Cover.12345
    Small Desert Lodge [Heavy Cover]                  : Small_Desert_Lodge_Heavy_Cover.12345
    Large Desert Arch [Heavy Cover]                   : Large_Desert_Arch_Heavy_Cover.12345
    Desert Outpost [Heavy Cover]                      : Desert_Outpost_Heavy_Cover.12345
    Desert Tower [Heavy Cover]                        : Desert_Tower_Heavy_Cover.12345
    Medium Desert Lodge [Heavy Cover]                 : Medium_Desert_Lodge_Heavy_Cover.12345
    Geonosis - \\"Badlands of N'g'zi\\"                   : Geonosis_-_Badlands_of_N_g_zi.12345
    Destroyed Advanced Dwarf Spider Droid [Heavy Cover](Area Terrain): Destroyed_Advanced_Dwarf_Spider_Droid_Heavy_Cover_Area_Terrain.12345
    Factory Entrance [Heavy Cover]                    : Factory_Entrance_Heavy_Cover.12345
    Fallen Rock Pillar [Heavy Cover]                  : Fallen_Rock_Pillar_Heavy_Cover.12345
    Dust                                              : Dust.12345
    Forward Command Center [Heavy Cover]              : Forward_Command_Center_Heavy_Cover.12345
    Felucia - \\"Acklay Graveyard\\"                      : Felucia_-_Acklay_Graveyard.12345
    Tall Grass [Light Cover](Area Terrain)            : Tall_Grass_Light_Cover_Area_Terrain.12345
    Large Plant [Heavy Cover]                         : Large_Plant_Heavy_Cover.12345
    Large Plant [ Heavy Cover]                        : Large_Plant_Heavy_Cover.12345
    Ruins [Heavy Cover]                               : Ruins_Heavy_Cover.12345
    Sand Barricades [Heavy Cover]                     : Sand_Barricades_Heavy_Cover.12345
    Rock Formation [Heavy  Cover]                     : Rock_Formation_Heavy_Cover.12345
    Acklay Corpse [Light Cover]                       : Acklay_Corpse_Light_Cover.12345
    Plant Cluster [Light Cover]                       : Plant_Cluster_Light_Cover.12345
    Green Light Spheres 2\\"-20\\"                        : Green_Light_Spheres_2_-20.12345
    Deployment                                        : Deployment.12345
    Roll Out                                          : Roll_Out.12345
    Deployment Boundary                               : Deployment_Boundary.12345
    Hemmed In                                         : Hemmed_In.12345
    Danger Close                                      : Danger_Close.12345
    Battle Lines                                      : Battle_Lines.12345
    The Long March                                    : The_Long_March.12345
    Major Offensive                                   : Major_Offensive.12345
    Disarray                                          : Disarray.12345
    Advanced Positions                                : Advanced_Positions.12345
    DATA DISK MOUNT                                   : DATA_DISK_MOUNT.12345
    GAME CONTROLLER                                   : GAME_CONTROLLER.12345
    Setup Conditions Button                           : Setup_Conditions_Button.12345
    Setup Deployment Button                           : Setup_Deployment_Button.12345
    Setup Objective Button                            : Setup_Objective_Button.12345
    Objectives                                        : Objectives.12345
    Payload                                           : Payload.12345
    Bomb Cart                                         : Bomb_Cart.12345
    Objective Token                                   : Objective_Token.12345
    Bombing Run                                       : Bombing_Run.12345
    Hostage Exchange                                  : Hostage_Exchange.12345
    Hostage (2)                                       : Hostage_2.12345
    Hostage (1)                                       : Hostage_1.12345
    Sabotage the Moisture Vaporators                  : Sabotage_the_Moisture_Vaporators.12345
    Wound Token                                       : Wound_Token.12345
    Key Positions                                     : Key_Positions.12345
    Intercept the Transmissions                       : Intercept_the_Transmissions.12345
    Recover the Supplies                              : Recover_the_Supplies.12345
    Conditions                                        : Conditions.12345
    Supply Drop                                       : Supply_Drop.12345
    Condition Token [4]                               : Condition_Token_4.12345
    Condition Token [1]                               : Condition_Token_1.12345
    Condition Token [2]                               : Condition_Token_2.12345
    Condition Token [3]                               : Condition_Token_3.12345
    Condition Token [5]                               : Condition_Token_5.12345
    Condition Token [6]                               : Condition_Token_6.12345
    Supply Card Deck                                  : Supply_Card_Deck.12345
    Grapnel-Harpoon                                   : Grapnel-Harpoon.12345
    Camoflauge                                        : Camoflauge.12345
    Arc Welder                                        : Arc_Welder.12345
    Precision Scopes                                  : Precision_Scopes.12345
    Field Scannner                                    : Field_Scannner.12345
    Targeting Rangefinder                             : Targeting_Rangefinder.12345
    Bacta Capsules                                    : Bacta_Capsules.12345
    Holoprojector                                     : Holoprojector.12345
    Fortified Positions                               : Fortified_Positions.12345
    Minefield                                         : Minefield.12345
    Mine Condition Token                              : Mine_Condition_Token.12345
    Rapid Reinforcements                              : Rapid_Reinforcements.12345
    Screen                                            : Screen.12345
    Breakthrough                                      : Breakthrough.12345
    All Terrain Objects                               : All_Terrain_Objects.12345
    Hills                                             : Hills.12345
    Rocks                                             : Rocks.12345
    Rock Formation [Light Cover]                      : Rock_Formation_Light_Cover.12345
    Rivers                                            : Rivers.12345
    River [No Cover]                                  : River_No_Cover.12345
    Vehicles                                          : Vehicles.12345
    YT-1300 [Heavy Cover]                             : YT-1300_Heavy_Cover.12345
    Bespin                                            : Bespin.12345
    Fountain [Heavy Cover]                            : Fountain_Heavy_Cover.12345
    Bespin Wall [Heavy Cover]                         : Bespin_Wall_Heavy_Cover.12345
    Small Park [Light Cover][Area Terrain]            : Small_Park_Light_Cover_Area_Terrain.12345
    Doodads                                           : Doodads.12345
    Floors                                            : Floors.12345
    Walkway Set                                       : Walkway_Set.12345
    Walls                                             : Walls.12345
    Landing Bay Set                                   : Landing_Bay_Set.12345
    Buildings                                         : Buildings.12345
    Outpost Walls                                     : Outpost_Walls.12345
    Outpost Wall Corner [Heavy Cover]                 : Outpost_Wall_Corner_Heavy_Cover.12345
    Shrine                                            : Shrine.12345
    Refinery Set                                      : Refinery_Set.12345
    Pilgrim Building A                                : Pilgrim_Building_A.12345
    Pilgrim Building House B                          : Pilgrim_Building_House_B.12345
    Laser Tower [Heavy Cover]                         : Laser_Tower_Heavy_Cover.12345
    Shack [Heavy Cover]                               : Shack_Heavy_Cover.12345
    Руины                                             : Руины.12345
    Топливные Трубы                                   : Топливные_Трубы.12345
    Crates and Barricades                             : Crates_and_Barricades.12345
    Баррикады                                         : Баррикады.12345
    Craters and Mounds                                : Craters_and_Mounds.12345
    Ice Mound [Light Cover]                           : Ice_Mound_Light_Cover.12345
    Trees and Woods                                   : Trees_and_Woods.12345
    Kashyyyk Tree House [Light Cover]                 : Kashyyyk_Tree_House_Light_Cover.12345
    Mound                                             : Mound.12345
    Clear Conditions                                  : Clear_Conditions.12345
    Limited Visibility                                : Limited_Visibility.12345
    Hostile Environment                               : Hostile_Environment.12345
    War Weary                                         : War_Weary.12345
    User Maps                                         : User_Maps.12345
    Kamino - Lone Pathfinder                          : Kamino_-_Lone_Pathfinder.12345
    Cannery [Heavy Cover]                             : Cannery_Heavy_Cover.12345
    Generator [Heavy Cover]                           : Generator_Heavy_Cover.12345
    Tilted Platform [Light Cover]                     : Tilted_Platform_Light_Cover.12345
    Decaying LAAT Gunship [Heavy Cover]               : Decaying_LAAT_Gunship_Heavy_Cover.12345
    Decompression Chamber [Heavy Cover]               : Decompression_Chamber_Heavy_Cover.12345
    Decaying T-65 X-Wing [Light Cover]                : Decaying_T-65_X-Wing_Light_Cover.12345
    Blast Shield [Heavy Cover]                        : Blast_Shield_Heavy_Cover.12345
    Sullust River Assault - GornCaptain               : Sullust_River_Assault_-_GornCaptain.12345
    Crashed TIE Bomber                                : Crashed_TIE_Bomber.12345
    Broken Walkway [Light Cover]                      : Broken_Walkway_Light_Cover.12345
    Crash Crater  [Light Cover]                       : Crash_Crater_Light_Cover.12345
    Cargo Crates                                      : Cargo_Crates.12345
    Crash Crater (Crater) [Light Cover]               : Crash_Crater_Crater_Light_Cover_.12345
    Fire                                              : Fire.12345
    Orange Smoke                                      : Orange_Smoke.12345
    Impact Crater [Light Cover]                       : Impact_Crater_Light_Cover.12345
    Crash Crater  [Heavy Cover]                       : Crash_Crater_Heavy_Cover.12345
    Turbolaser Tower                                  : Turbolaser_Tower.12345
    Bridge                                            : Bridge.12345
    Crashed Interceptor                               : Crashed_Interceptor.12345
    Cargo Crate                                       : Cargo_Crate.12345
    Reclaimed Rebel Port - Muerto Gonzo               : Reclaimed_Rebel_Port_-_Muerto_Gonzo.12345
    Endor Station - OPKenobi                          : Endor_Station_-_OPKenobi.12345
    Ladder                                            : Ladder.12345
    Large Stone Barricade [Heavy Cover]               : Large_Stone_Barricade_Heavy_Cover.12345
    Dust Cloud                                        : Dust_Cloud.12345
    Radio [Light Cover]                               : Radio_Light_Cover.12345
    Sandbags (Light Cover)                            : Sandbags_Light_Cover.12345
    Storage Crate [Heavy Cover]                       : Storage_Crate_Heavy_Cover.12345
    Outpost Assault - BattleBear                      : Outpost_Assault_-_BattleBear.12345
    Rubble (Impassable)                               : Rubble_Impassable.12345
    Destroyed Settlement (Difficult)                  : Destroyed_Settlement_Difficult.12345
    Commo Dish                                        : Commo_Dish.12345
    Hill                                              : Hill.12345
    Cliff, Main Body (Completely Impassable)          : Cliff_Main_Body_Completely_Impassable.12345
    Pile (Difficult; see description)                 : Pile_Difficult;_see_description.12345
    Cliff (Difficult; see description)                : Cliff_Difficult;_see_description.12345
    Bantha Meat Smoker                                : Bantha_Meat_Smoker.12345
    Lambda class shuttle                              : Lambda_class_shuttle.12345
    Crate                                             : Crate.12345
    Sith Temple - BattleBear                          : Sith_Temple_-_BattleBear.12345
    Sith Rock                                         : Sith_Rock.12345
    Ancient Sith Tower                                : Ancient_Sith_Tower.12345
    Forgotten Sith Lord                               : Forgotten_Sith_Lord.12345
    Broken Monument Base                              : Broken_Monument_Base.12345
    Monument Base                                     : Monument_Base.12345
    Sith Temple                                       : Sith_Temple.12345
    Beach Ruins - chrispetersen77                     : Beach_Ruins_-_chrispetersen77.12345
    Ruins Fence (Light Cover)                         : Ruins_Fence_Light_Cover.12345
    Flooded Ruins (Light Cover)                       : Flooded_Ruins_Light_Cover.12345
    Ruins- Heavy Cover                                : Ruins-_Heavy_Cover.12345
    Ruins (Heavy Cover)                               : Ruins_Heavy_Cover.12345
    Ruins (Light Cover)                               : Ruins_Light_Cover.12345
    Ion River - chrispetersen77                       : Ion_River_-_chrispetersen77.12345
    Fallen Redwood Tree [Heavy Cover]                 : Fallen_Redwood_Tree_Heavy_Cover.12345
    Small Stone Bridge                                : Small_Stone_Bridge.12345
    Ion River (No Cover)                              : Ion_River_No_Cover.12345
    Forest Pin - chrispetersen77                      : Forest_Pin_-_chrispetersen77.12345
    Red Z-6 Trooper                                   : Red_Z-6_Trooper.12345
    Ladder [Climb]                                    : Ladder_Climb.12345
    Bunker - Elevated Terrain                         : Bunker_-_Elevated_Terrain.12345
    Small Hill [Heavy Cover]                          : Small_Hill_Heavy_Cover.12345
    Large Hill [Blocking]                             : Large_Hill_Blocking.12345
    Trees [Light Cover]                               : Trees_Light_Cover.12345
    Competitive Placement Terrain                     : Competitive_Placement_Terrain.12345
    Forest                                            : Forest.12345
    RED COMMAND TRAY                                  : RED_COMMAND_TRAY.12345
    BLUE COMMAND TRAY                                 : BLUE_COMMAND_TRAY.12345
    gameData                                          : gameData.12345
    Deck Builder                                      : Deck_Builder.12345
    BATTLEFIELD DECK                                  : BATTLEFIELD_DECK.12345
    Blue Army Point Cost                              : Blue_Army_Point_Cost.12345
    Gathering Legions                                 : Gathering_Legions.12345
    GL: Imperial Regional Spaceport                   : GL_Imperial_Regional_Spaceport.12345
    GL: South Slums                                   : GL_South_Slums.12345
    GL: Governer's Estate                             : GL_Governer_s_Estate.12345
    GL: Rebel Regional Spaceport                      : GL_Rebel_Regional_Spaceport.12345
    GL: Neutral Regional Spaceport (Urban, Moderate)  : GL_Neutral_Regional_Spaceport_Urban_Moderate.12345
    GL: North City Walls                              : GL_North_City_Walls.12345
    Gathering Legions: North Walls (Fortified, Modera): Gathering_Legions_North_Walls_Fortified_Modera.12345
    GL: Temple Grounds                                : GL_Temple_Grounds.12345
    Gathering Legions: Temple Grounds (Ruins, Moderat): Gathering_Legions_Temple_Grounds_Ruins_Moderat.12345
     Mud Pits [Light Cover]                           : Mud_Pits_Light_Cover.12345
    Mud Pits [Light Cover]                            : Mud_Pits_Light_Cover.12345
    GL: Artisan District                              : GL_Artisan_District.12345
    Gathering Legions: Artisan District (Urban, Moder): Gathering_Legions_Artisan_District_Urban_Moder.12345
    Artisan Dwelling (Building) [Heavy Cover]         : Artisan_Dwelling_Building_Heavy_Cover.12345
    Gl: Ancient Ruins                                 : Gl_Ancient_Ruins.12345
    Gathering Legions: Ancient Ruins (Ruins, Sparse)  : Gathering_Legions_Ancient_Ruins_Ruins_Sparse.12345
    GL: Trade Route                                   : GL_Trade_Route.12345
    Gathering Legions: Trade Route (Wild, Sparse)     : Gathering_Legions_Trade_Route_Wild_Sparse.12345
    Tiny Cliff [Heavy Cover]                          : Tiny_Cliff_Heavy_Cover.12345
    GL: Old Market District                           : GL_Old_Market_District.12345
    Gathering Legions: Old Market (Urban, Dense)      : Gathering_Legions_Old_Market_Urban_Dense.12345
    Shop (Building) [Heavy Cover]                     : Shop_Building_Heavy_Cover.12345
    GL: Insurgent Base                                : GL_Insurgent_Base.12345
    GL: Refugee Camp                                  : GL_Refugee_Camp.12345
    Gathering Legions: Refugee Camp (Urban, Sparse)   : Gathering_Legions_Refugee_Camp_Urban_Sparse.12345
    Battle Lines Competitive                          : Battle_Lines_Competitive.12345
    Sulfur Spring (Mbweha Ben)                        : Sulfur_Spring_Mbweha_Ben.12345
    Multi-colored smoke                               : Multi-colored_smoke.12345
    Sulfur Spring [no cover]                          : Sulfur_Spring_no_cover.12345
    Fallen Log [Light Cover]                          : Fallen_Log_Light_Cover.12345
    Log Pile (Wall) [Heavy Cover]                     : Log_Pile_Wall_Heavy_Cover.12345
    Stacked Cargo Crates [Heavy Cover]                : Stacked_Cargo_Crates_Heavy_Cover.12345
    Dense Woods [Heavy Cover, Area Terrain]           : Dense_Woods_Heavy_Cover_Area_Terrain.12345
    Sparse Woods [Light Cover, Area Terrain]          : Sparse_Woods_Light_Cover_Area_Terrain.12345
    Fallen Log - Bridge [Light Cover]                 : Fallen_Log_-_Bridge_Light_Cover.12345
    Shallow Stream [No Cover]                         : Shallow_Stream_No_Cover.12345
    Smoke Effect                                      : Smoke_Effect.12345
    Forest Moon Supply Outpost (Ellis)                : Forest_Moon_Supply_Outpost_Ellis.12345
    Corulag Coliseum (Mbweha Ben)                     : Corulag_Coliseum_Mbweha_Ben.12345
    Staging Zone Wall [Heavy Cover]                   : Staging_Zone_Wall_Heavy_Cover.12345
    Sniper Tower (Building) [Heavy Cover]             : Sniper_Tower_Building_Heavy_Cover.12345
    Staging Zone Doorway [Heavy Cover]                : Staging_Zone_Doorway_Heavy_Cover.12345
    Staging Zone Building (lvl 2) [Heavy Cover]       : Staging_Zone_Building_lvl_2_Heavy_Cover.12345
    Struts [Light Cover]                              : Struts_Light_Cover.12345
    Platform [Heavy Cover]                            : Platform_Heavy_Cover.12345
    Sniper Tower [Heavy Cover]                        : Sniper_Tower_Heavy_Cover.12345
    Walkway [Heavy Cover]                             : Walkway_Heavy_Cover.12345
    VIP Box Seats [Heavy Cover]                       : VIP_Box_Seats_Heavy_Cover.12345
    Staging Zone Entrance [Heavy Cover]               : Staging_Zone_Entrance_Heavy_Cover.12345
    Staging Zone Building (lvl 1) [Heavy Cover]       : Staging_Zone_Building_lvl_1_Heavy_Cover.12345
    Broadcast Tower [Heavy Cover]                     : Broadcast_Tower_Heavy_Cover.12345
    Ryloth Sandstorm (Mbweha Ben)                     : Ryloth_Sandstorm_Mbweha_Ben.12345
    Desert Hill [light cover]                         : Desert_Hill_light_cover.12345
    Desert Dwelling (Building) [Heavy Cover]          : Desert_Dwelling_Building_Heavy_Cover.12345
    Darude's Repair Shop (Building) [Heavy Cover]     : Darude_s_Repair_Shop_Building_Heavy_Cover.12345
    Parked Landspeeder [Light Cover]                  : Parked_Landspeeder_Light_Cover.12345
    Mechanic's House (Building) [Heavy Cover]         : Mechanic_s_House_Building_Heavy_Cover.12345
    Balcony [Heavy Cover]                             : Balcony_Heavy_Cover.12345
    Desert Hut (Building) [Heavy Cover]               : Desert_Hut_Building_Heavy_Cover.12345
    Vaporator [Light Cover]                           : Vaporator_Light_Cover.12345
    Echo Base Eastern Ridge (Nerfley)                 : Echo_Base_Eastern_Ridge_Nerfley.12345
    Trench Barricade [Heavy Cover]                    : Trench_Barricade_Heavy_Cover.12345
    Ice Mound [Light Cover](Area Terrain)             : Ice_Mound_Light_Cover_Area_Terrain.12345
    Lothal Supply Hold (Garnanana)                    : Lothal_Supply_Hold_Garnanana.12345
    Grass Mound [Light Cover] Area Terrain            : Grass_Mound_Light_Cover_Area_Terrain.12345
    Tall Grass area terrain                           : Tall_Grass_area_terrain.12345
    Grass Mound {Light Cover]                         : Grass_Mound_{Light_Cover.12345
    Grass Mound  [Light Cover]                        : Grass_Mound_Light_Cover.12345
    Tall Grass area Terrain                           : Tall_Grass_area_Terrain.12345
    Kashykk Crossing (Garnanana)                      : Kashykk_Crossing_Garnanana.12345
    Forward Shield Generator (Garnanana)              : Forward_Shield_Generator_Garnanana.12345
    Small Cliff [Light cover]                         : Small_Cliff_Light_cover.12345
    Mustafar Mining Operation (Garnanana)             : Mustafar_Mining_Operation_Garnanana.12345
    Smoking Lava Mound (Blast Hole) [Light Cover]     : Smoking_Lava_Mound_Blast_Hole_Light_Cover.12345
    smoking Lava Mound (Blast Hole) [Light Cover]     : smoking_Lava_Mound_Blast_Hole_Light_Cover.12345
    Sullust Weapons Plant (Spiritoffire)              : Sullust_Weapons_Plant_Spiritoffire.12345
    Flame Glowing                                     : Flame_Glowing.12345
    Pipe Segment [Heavy/Light Cover]                  : Pipe_Segment_Heavy_Light_Cover.12345
    Red Light Spheres 2\\"-20\\"                          : Red_Light_Spheres_2_-20.12345
    Landing Platform [Heavy Cover]                    : Landing_Platform_Heavy_Cover.12345
    Rocks Heavy Cover                                 : Rocks_Heavy_Cover.12345
    Crashed T-65 X-Wing [Light/Heavy Cover]           : Crashed_T-65_X-Wing_Light_Heavy_Cover.12345
    Dripping Magma                                    : Dripping_Magma.12345
    City Center (Supernerd)                           : City_Center_Supernerd.12345
    Mud [Light Cover]                                 : Mud_Light_Cover.12345
    Generator (Building) [Heavy Cover]                : Generator_Building_Heavy_Cover.12345
    Shop Canvas (Building) [Light Cover]              : Shop_Canvas_Building_Light_Cover.12345
    Refugee Camp (Supernerd)                          : Refugee_Camp_Supernerd.12345
    Clandestine Landing (Kingsley)                    : Clandestine_Landing_Kingsley.12345
    Outpost on Farrin IV (Asyer)                      : Outpost_on_Farrin_IV_Asyer.12345
    Snow Drift [Light Cover]                          : Snow_Drift_Light_Cover.12345
    Heavy snow - from above                           : Heavy_snow_-_from_above.12345
    Snow Fall - Light/Heavy                           : Snow_Fall_-_Light_Heavy.12345
    Light snow - from cube                            : Light_snow_-_from_cube.12345
    Heavy snow - from cube                            : Heavy_snow_-_from_cube.12345
    Steam                                             : Steam.12345
    Scorched Earth (Copes)                            : Scorched_Earth_Copes.12345
    Endor Storage Post (Thomas)                       : Endor_Storage_Post_Thomas.12345
    Cargo Crates [Heavy Cover] Layer 1                : Cargo_Crates_Heavy_Cover_Layer_1.12345
    Large Fallen Trunk [Heavy Cover]                  : Large_Fallen_Trunk_Heavy_Cover.12345
    Tree [Heavy Cover]                                : Tree_Heavy_Cover.12345
    Antena [Light Cover]                              : Antena_Light_Cover.12345
    Cargo Crates [Heavy Cover] Layer 2                : Cargo_Crates_Heavy_Cover_Layer_2.12345
    Cargo Crates [Heavy Cover] Layer 3                : Cargo_Crates_Heavy_Cover_Layer_3.12345
    Big Ol' Tree [Heavy Cover]                        : Big_Ol_Tree_Heavy_Cover.12345
    Battle Lines Creative                             : Battle_Lines_Creative.12345
    River Valley (Asyer)                              : River_Valley_Asyer.12345
    Vardos Avenue (Nerfley)                           : Vardos_Avenue_Nerfley.12345
    Shop [Heavy Cover]                                : Shop_Heavy_Cover.12345
    Residential Block [Light Cover]                   : Residential_Block_Light_Cover.12345
    Dark Metal                                        : Dark_Metal.12345
    Apartment [Heavy Cover]                           : Apartment_Heavy_Cover.12345
    Store [Heavy Cover]                               : Store_Heavy_Cover.12345
    Guard Tower ([Heavy Cover]                        : Guard_Tower_Heavy_Cover.12345
    Scarif Beach Platform (Nerfley)                   : Scarif_Beach_Platform_Nerfley.12345
    Sparse Jungle [Light Cover](Area Terrain)         : Sparse_Jungle_Light_Cover_Area_Terrain.12345
    Landing Platform [Light Cover]                    : Landing_Platform_Light_Cover.12345
    Crashed T-65 X-Wing [Heavy/Light/No Cover]        : Crashed_T-65_X-Wing_Heavy_Light_No_Cover.12345
    Temple Grounds (Supernerd)                        : Temple_Grounds_Supernerd.12345
    South Slums (Supernerd)                           : South_Slums_Supernerd.12345
    Artisan District (Supernerd)                      : Artisan_District_Supernerd.12345
    Bedroom Wars (Garnanana)                          : Bedroom_Wars_Garnanana.12345
    M&Ms                                              : M&Ms.12345
    Pryamid                                           : Pryamid.12345
    ramp                                              : ramp.12345
    Roger roger                                       : Roger_roger.12345
    Iphone                                            : Iphone.12345
    Heavy cover Heigh 2                               : Heavy_cover_Heigh_2.12345
    bottle cap                                        : bottle_cap.12345
    Yellow teeter-totter                              : Yellow_teeter-totter.12345
    Arch                                              : Arch.12345
    Archway Height 1                                  : Archway_Height_1.12345
    Pop or soda                                       : Pop_or_soda.12345
    STAIRS                                            : STAIRS.12345
    Lego                                              : Lego.12345
    spilled candy bag                                 : spilled_candy_bag.12345
    Stairs                                            : Stairs.12345
    Bait and Switch                                   : Bait_and_Switch.12345
    chip                                              : chip.12345
    block                                             : block.12345
    Keyforge Deck                                     : Keyforge_Deck.12345
    Nocturnal Maneuver                                : Nocturnal_Maneuver.12345
    Save the Pack                                     : Save_the_Pack.12345
    Troop Call                                        : Troop_Call.12345
    Lifeweb                                           : Lifeweb.12345
    Ring of Invisibility                              : Ring_of_Invisibility.12345
    Urchin                                            : Urchin.12345
    Routine Job                                       : Routine_Job.12345
    Speed Sigil                                       : Speed_Sigil.12345
    Umbra                                             : Umbra.12345
    Poison Wave                                       : Poison_Wave.12345
    Nerve Blast                                       : Nerve_Blast.12345
    Ghostly Hand                                      : Ghostly_Hand.12345
    Pit Demon                                         : Pit_Demon.12345
    Charette                                          : Charette.12345
    Dust Imp                                          : Dust_Imp.12345
    Ember Imp                                         : Ember_Imp.12345
    Shooler                                           : Shooler.12345
    Flame Wreathed                                    : Flame_Wreathed.12345
    Sequis                                            : Sequis.12345
    Tendrils of Pain                                  : Tendrils_of_Pain.12345
    Control the Weak                                  : Control_the_Weak.12345
    Sacrificial Altar                                 : Sacrificial_Altar.12345
    Bigtwig                                           : Bigtwig.12345
    Mighty Tiger                                      : Mighty_Tiger.12345
    Niffle Ape                                        : Niffle_Ape.12345
    Way of the Wolf                                   : Way_of_the_Wolf.12345
    Ancient Bear                                      : Ancient_Bear.12345
    Hand of Dis                                       : Hand_of_Dis.12345
    The Terror                                        : The_Terror.12345
    Block                                             : Block.12345
    Autographed Picture                               : Autographed_Picture.12345
    chess piece                                       : chess_piece.12345
    Die                                               : Die.12345
    brown Teeter totter base                          : brown_Teeter_totter_base.12345
    Ramp                                              : Ramp.12345
    triangle top                                      : triangle_top.12345
    2 square                                          : 2_square.12345
    lego                                              : lego.12345
    Block (height 1)                                  : Block_height_1.12345
    Doritos (height 2)                                : Doritos_height_2.12345
    Pencil                                            : Pencil.12345
    Dense Forest Map (Supernerd)                      : Dense_Forest_Map_Supernerd.12345
    Old Market District (Supernerd)                   : Old_Market_District_Supernerd.12345
    North City Walls (Supernerd)                      : North_City_Walls_Supernerd.12345
    Ancient Ruins (Supernerd)                         : Ancient_Ruins_Supernerd.12345
    War Torn Forest (Supernerd)                       : War_Torn_Forest_Supernerd.12345
    Dirt Mound (Blast Hole) [Light Cover]             : Dirt_Mound_Blast_Hole_Light_Cover.12345
    Crashed Vehicle [Heavy Cover]                     : Crashed_Vehicle_Heavy_Cover.12345
    Dirt Mound (Blast Hole) [Heavy Cover]             : Dirt_Mound_Blast_Hole_Heavy_Cover.12345
    Jundland Homestead (Nerfley)                      : Jundland_Homestead_Nerfley.12345
    Ladder [No Cover]                                 : Ladder_No_Cover.12345
    Carkoon Tourist Trap (Mbweha Ben)                 : Carkoon_Tourist_Trap_Mbweha_Ben.12345
    Restrooms [Heavy Cover]                           : Restrooms_Heavy_Cover.12345
    Boba Fett Memorial                                : Boba_Fett_Memorial.12345
    Vaporator [light cover]                           : Vaporator_light_cover.12345
    Parked Speeder [light cover]                      : Parked_Speeder_light_cover.12345
    Gift Shop [Heavy Cover]                           : Gift_Shop_Heavy_Cover.12345
    Boba Fett Memorial [Light Cover]                  : Boba_Fett_Memorial_Light_Cover.12345
    Sarlacc                                           : Sarlacc.12345
    Sail Barge Wreckage [Heavy Cover]                 : Sail_Barge_Wreckage_Heavy_Cover.12345
    Ticket Booth [Heavy Cover]                        : Ticket_Booth_Heavy_Cover.12345
    Spaceport (Asyer)                                 : Spaceport_Asyer.12345
    Fule Storage                                      : Fule_Storage.12345
    Fuel Storage                                      : Fuel_Storage.12345
    Desert Base (Asyer)                               : Desert_Base_Asyer.12345
    Forest through the Trees (Asyer)                  : Forest_through_the_Trees_Asyer.12345
    Industrial District (Asyer)                       : Industrial_District_Asyer.12345
    Carbon Venting System                             : Carbon_Venting_System.12345
    Pump Station                                      : Pump_Station.12345
    Trash Pile                                        : Trash_Pile.12345
    Crucible                                          : Crucible.12345
    Rebel Hangar Bay (Spiritoffire)                   : Rebel_Hangar_Bay_Spiritoffire.12345
    Doorway                                           : Doorway.12345
    Chair [Light]                                     : Chair_Light.12345
    Terminal [Light]                                  : Terminal_Light.12345
    Lockers [Heavy]                                   : Lockers_Heavy.12345
    Wall [Heavy cover]                                : Wall_Heavy_cover.12345
    Mechanics Workbench [Heavy]                       : Mechanics_Workbench_Heavy.12345
    Window                                            : Window.12345
    Desk                                              : Desk.12345
    Terminal                                          : Terminal.12345
    Pazaak Cards                                      : Pazaak_Cards.12345
    Access Panel                                      : Access_Panel.12345
    Chest [Heavy]                                     : Chest_Heavy.12345
    Footlocker                                        : Footlocker.12345
    Table [Heavy]                                     : Table_Heavy.12345
    Hover Sled [Light]                                : Hover_Sled_Light.12345
    Barrel [Heavy]                                    : Barrel_Heavy.12345
    Broken Gonk Droid                                 : Broken_Gonk_Droid.12345
    Comm Panel [Light]                                : Comm_Panel_Light.12345
    Executive Desk [Heavy]                            : Executive_Desk_Heavy.12345
    Fear, Suprise, Intimidation                       : Fear_Suprise_Intimidation.12345
    Trained in Your Jedi Arts                         : Trained_in_Your_Jedi_Arts.12345
    Supreme Commander                                 : Supreme_Commander.12345
    You Disappoint Me                                 : You_Disappoint_Me.12345
    Call Me Captain                                   : Call_Me_Captain.12345
    Take That, Clankers!                              : Take_That_Clankers!.12345
    Crush Them!                                       : Crush_Them!.12345
    Were Not Programmed                               : Were_Not_Programmed.12345
    Hello There!                                      : Hello_There!.12345
    Knowledge and Defense                             : Knowledge_and_Defense.12345
    General Kenobi                                    : General_Kenobi.12345
    You Serve Your Master Well                        : You_Serve_Your_Master_Well.12345
    Full of Surprises                                 : Full_of_Surprises.12345
    I am a Jedi                                       : I_am_a_Jedi.12345
    Darkness Descends                                 : Darkness_Descends.12345
    Fear and Dead Men                                 : Fear_and_Dead_Men.12345
    Ambush Alt Art                                    : Ambush_Alt_Art.12345
    Ambush                                            : Ambush.12345
    Whipcord Launcher                                 : Whipcord_Launcher.12345
    Implacable                                        : Implacable.12345
    And Now... You Will Die                           : And_Now._You_Will_Die.12345
    Son of Skywalker                                  : Son_of_Skywalker.12345
    ZX Flame Projector                                : ZX_Flame_Projector.12345
    Give in to Your Anger                             : Give_in_to_Your_Anger.12345
    Merciless Munitions                               : Merciless_Munitions.12345
    Brains and Brawn                                  : Brains_and_Brawn.12345
    Reptilian Rampage                                 : Reptilian_Rampage.12345
    New Ways to Motivate Them                         : New_Ways_to_Motivate_Them.12345
    My Ally Is the Force                              : My_Ally_Is_the_Force.12345
    Z-6 Jetpack Rocket                                : Z-6_Jetpack_Rocket.12345
    Common Cause                                      : Common_Cause.12345
    Return of the Jedi                                : Return_of_the_Jedi.12345
    Standing Orders                                   : Standing_Orders.12345
    Lying in Wait                                     : Lying_in_Wait.12345
    An Entire Legion                                  : An_Entire_Legion.12345
    Master of Evil                                    : Master_of_Evil.12345
    Notorious Scoundrels                              : Notorious_Scoundrels.12345
    Pinned Down                                       : Pinned_Down.12345
    Coordinated Fire                                  : Coordinated_Fire.12345
    Covert Observation                                : Covert_Observation.12345
    Rebellious                                        : Rebellious.12345
    Coordinated Bombardment                           : Coordinated_Bombardment.12345
    Voracious Ambition                                : Voracious_Ambition.12345
    Maximum Firepower                                 : Maximum_Firepower.12345
    Sorry About the Mess                              : Sorry_About_the_Mess.12345
    Explosions!                                       : Explosions!.12345
    Sabotaged Communications                          : Sabotaged_Communications.12345
    Covering Fire                                     : Covering_Fire.12345
    No Time for Sorrows                               : No_Time_for_Sorrows.12345
    Deploy the Garrison                               : Deploy_the_Garrison.12345
    Reckless Diversion                                : Reckless_Diversion.12345
    Turning the Tide                                  : Turning_the_Tide.12345
    Trust Goes Both Ways                              : Trust_Goes_Both_Ways.12345
    Evasive Maneuvers                                 : Evasive_Maneuvers.12345
    Symbol of Rebellion                               : Symbol_of_Rebellion.12345
    Annihilation Looms                                : Annihilation_Looms.12345
    Complete the Mission                              : Complete_the_Mission.12345
    Imperial Discipline                               : Imperial_Discipline.12345
    Change of Plans                                   : Change_of_Plans.12345
    Somebody Has to Save Our Skins                    : Somebody_Has_to_Save_Our_Skins.12345
    Legacy of Mandalore                               : Legacy_of_Mandalore.12345
    Push Alt Art                                      : Push_Alt_Art.12345
    Push                                              : Push.12345
    Assault                                           : Assault.12345
    Assault Alt Art                                   : Assault_Alt_Art.12345
    Vaders Might                                      : Vaders_Might.12345
    Blast Off!                                        : Blast_Off!.12345
    Impromptu Immolation                              : Impromptu_Immolation.12345
    Crack Shot                                        : Crack_Shot.12345
    Smoke Screen                                      : Smoke_Screen.12345
    Pulse Scan                                        : Pulse_Scan.12345
    Double the Fall                                   : Double_the_Fall.12345
    Last Stand                                        : Last_Stand.12345
    Volunteer Mission                                 : Volunteer_Mission.12345
    Incapacitate                                      : Incapacitate.12345
    Tactical Strike                                   : Tactical_Strike.12345
    Concussive Blast                                  : Concussive_Blast.12345
    Sacrifice                                         : Sacrifice.12345
    I Make The Rules Now                              : I_Make_The_Rules_Now.12345
    Im In Control                                     : Im_In_Control.12345
    Our Fate Is In Your Hands                         : Our_Fate_Is_In_Your_Hands.12345
    Diplomatic Cover                                  : Diplomatic_Cover.12345
    R2-D2                                             : R2-D2.12345
    C-3PO                                             : C-3PO.12345
    AAT Trade Federation Battle Tank                  : AAT_Trade_Federation_Battle_Tank.12345
    Droidekas                                         : Droidekas.12345
    B1 Battle Droids                                  : B1_Battle_Droids.12345
    General Grievous                                  : General_Grievous.12345
    Clone Captain Rex                                 : Clone_Captain_Rex.12345
    BARC Speeder                                      : BARC_Speeder.12345
    Phase I Clone Troopers                            : Phase_I_Clone_Troopers.12345
    Obi-Wan Kenobi                                    : Obi-Wan_Kenobi.12345
    Chewbacca                                         : Chewbacca.12345
    Rebel Veterans                                    : Rebel_Veterans.12345
    DF-90 Mortar Trooper                              : DF-90_Mortar_Trooper.12345
    Mark II Medium Blaster Trooper                    : Mark_II_Medium_Blaster_Trooper.12345
    Shoretroopers                                     : Shoretroopers.12345
    T-47 Airspeeder                                   : T-47_Airspeeder.12345
    74-Z Speeder Bikes                                : 74-Z_Speeder_Bikes.12345
    General Veers                                     : General_Veers.12345
    AT-ST                                             : AT-ST.12345
    Stormtroopers                                     : Stormtroopers.12345
    Luke Skywalker                                    : Luke_Skywalker.12345
    Rebel Troopers                                    : Rebel_Troopers.12345
    AT-RT                                             : AT-RT.12345
    Darth Vader                                       : Darth_Vader.12345
    Snowtroopers                                      : Snowtroopers.12345
    Boba Fett                                         : Boba_Fett.12345
    Fleet Troopers                                    : Fleet_Troopers.12345
    Scout Troopers Strike Team                        : Scout_Troopers_Strike_Team.12345
    Leia Organa                                       : Leia_Organa.12345
    Jyn Erso                                          : Jyn_Erso.12345
    Bossk                                             : Bossk.12345
    Rebel Pathfinders                                 : Rebel_Pathfinders.12345
    Imperial Death Troopers                           : Imperial_Death_Troopers.12345
    X-34 Landspeeder                                  : X-34_Landspeeder.12345
    Sabine Wren                                       : Sabine_Wren.12345
    Imperial Officer                                  : Imperial_Officer.12345
    Emperor Palpatine                                 : Emperor_Palpatine.12345
    Scout Troopers                                    : Scout_Troopers.12345
    Han Solo                                          : Han_Solo.12345
    Rebel Commandos Strike Team                       : Rebel_Commandos_Strike_Team.12345
    Rebel Commandos                                   : Rebel_Commandos.12345
    Rebel Officer                                     : Rebel_Officer.12345
    Imperial Royal Guards                             : Imperial_Royal_Guards.12345
    Iden Versio                                       : Iden_Versio.12345
    Cassian Andor                                     : Cassian_Andor.12345
    1.4 FD Laser Cannon Team                          : 1.4_FD_Laser_Cannon_Team.12345
    Luke Skywalker Jedi Knight                        : Luke_Skywalker_Jedi_Knight.12345
    Tauntaun Riders                                   : Tauntaun_Riders.12345
    TX-225 GAVw Occupier                              : TX-225_GAVw_Occupier.12345
    Dewback Rider                                     : Dewback_Rider.12345
    E-Web Heavy Blaster Team                          : E-Web_Heavy_Blaster_Team.12345
    Darth Vader The Emperors Apprentice               : Darth_Vader_The_Emperors_Apprentice.12345
    Director Orson Krennic                            : Director_Orson_Krennic.12345
    B2 Super Battle Droids                            : B2_Super_Battle_Droids.12345
    Phase II Clone Troopers                           : Phase_II_Clone_Troopers.12345
    TX-130 Saber-Class Fighter Tank                   : TX-130_Saber-Class_Fighter_Tank.12345
    Count Dooku                                       : Count_Dooku.12345
    Wookiee Warriors                                  : Wookiee_Warriors.12345
    K-2SO                                             : K-2SO.12345
    Idens ID10 Seeker Droid                           : Idens_ID10_Seeker_Droid.12345
    ARC Troopers                                      : ARC_Troopers.12345
    ARC Troopers Strike Team                          : ARC_Troopers_Strike_Team.12345
    BX Commando Droids                                : BX_Commando_Droids.12345
    BX Commando Droids Strike Team                    : BX_Commando_Droids_Strike_Team.12345
    Padme Amidala                                     : Padme_Amidala.12345
    Cad Bane                                          : Cad_Bane.12345
    Republic AT-RT                                    : Republic_AT-RT.12345
    STAP Riders                                       : STAP_Riders.12345
    Red Die Roller                                    : Red_Die_Roller.12345
    RETURN TOKENS                                     : RETURN_TOKENS.12345
    REMOVE SUPPRESSION                                : REMOVE_SUPPRESSION.12345
    SETUP CONTROLLER                                  : SETUP_CONTROLLER.12345
    Victory Tokens                                    : Victory_Tokens.12345
    Victory Token                                     : Victory_Token.12345
    Condition Tokens                                  : Condition_Tokens.12345
    Standby Tokens                                    : Standby_Tokens.12345
    Standby Token                                     : Standby_Token.12345
    Disabled Tokens                                   : Disabled_Tokens.12345
    Disabled Token                                    : Disabled_Token.12345
    Damaged Tokens                                    : Damaged_Tokens.12345
    Damaged Token                                     : Damaged_Token.12345
    Aim Tokens                                        : Aim_Tokens.12345
    Aim Token                                         : Aim_Token.12345
    Dodge Tokens                                      : Dodge_Tokens.12345
    Dodge Token                                       : Dodge_Token.12345
    Ion Tokens                                        : Ion_Tokens.12345
    Ion Token                                         : Ion_Token.12345
    Suppression Tokens                                : Suppression_Tokens.12345
    Suppression Token                                 : Suppression_Token.12345
    Commander Token                                   : Commander_Token.12345
    Weapon Destroyed Tokens                           : Weapon_Destroyed_Tokens.12345
    Weapon Destroyed Token                            : Weapon_Destroyed_Token.12345
    Panic Tokens                                      : Panic_Tokens.12345
    Panic Token                                       : Panic_Token.12345
    Unit ID Token                                     : Unit_ID_Token.12345
    Red Command Stack                                 : Red_Command_Stack.12345
    BLUE Command Stack                                : BLUE_Command_Stack.12345
    Immobilize Tokens                                 : Immobilize_Tokens.12345
    Immobilize Token                                  : Immobilize_Token.12345
    Proton Charge Tokens                              : Proton_Charge_Tokens.12345
    Proton Charge Token                               : Proton_Charge_Token.12345
    Blue Die Roller                                   : Blue_Die_Roller.12345
    Red Deck                                          : Red_Deck.12345
    Blue Deck                                         : Blue_Deck.12345
    DP-23 Phase I Trooper                             : DP-23_Phase_I_Trooper.12345
    E-5s B1 Trooper                                   : E-5s_B1_Trooper.12345
    B1 Security Droid                                 : B1_Security_Droid.12345
    RPS-6 Phase I Trooper                             : RPS-6_Phase_I_Trooper.12345
    OOM-Series Battle Droid                           : OOM-Series_Battle_Droid.12345
    Phase I Clone Captain                             : Phase_I_Clone_Captain.12345
    Stormtrooper Specialist                           : Stormtrooper_Specialist.12345
    RT-97C Stormtrooper                               : RT-97C_Stormtrooper.12345
    T-21 Stormtrooper                                 : T-21_Stormtrooper.12345
    Radiation Cannon B1 Trooper                       : Radiation_Cannon_B1_Trooper.12345
    Phase I Clone Specialist                          : Phase_I_Clone_Specialist.12345
    Stormtrooper Captain                              : Stormtrooper_Captain.12345
    Rebel Trooper Specialist                          : Rebel_Trooper_Specialist.12345
    SX-21 Trooper                                     : SX-21_Trooper.12345
    DLT-20A Trooper                                   : DLT-20A_Trooper.12345
    Rebel Trooper Captain                             : Rebel_Trooper_Captain.12345
    Z-6 Phase I Trooper                               : Z-6_Phase_I_Trooper.12345
    B2 Super Battle Droid                             : B2_Super_Battle_Droid.12345
    Phase II Clone Trooper                            : Phase_II_Clone_Trooper.12345
    Phase I Clone Trooper                             : Phase_I_Clone_Trooper.12345
    DC-15 Phase I Trooper                             : DC-15_Phase_I_Trooper.12345
    BARC Twin Laser Gunner                            : BARC_Twin_Laser_Gunner.12345
    BARC RPS-6 Gunner                                 : BARC_RPS-6_Gunner.12345
    BARC Ion Gunner                                   : BARC_Ion_Gunner.12345
    E-60R B1 Trooper                                  : E-60R_B1_Trooper.12345
    E-5C B1 Trooper                                   : E-5C_B1_Trooper.12345
    DT-57 \\"Annihilator\\"                               : DT-57_Annihilator.12345
    B1 Battle Droid                                   : B1_Battle_Droid.12345
    Aggressive Tactics                                : Aggressive_Tactics.12345
    Force Guidance                                    : Force_Guidance.12345
    Hope                                              : Hope.12345
    Overcharged Generator                             : Overcharged_Generator.12345
    Force Choke                                       : Force_Choke.12345
    Force Push                                        : Force_Push.12345
    Battle Meditation                                 : Battle_Meditation.12345
    Anger                                             : Anger.12345
    Commanding Presence                               : Commanding_Presence.12345
    Long-Range Comlink                                : Long-Range_Comlink.12345
    HQ Uplink                                         : HQ_Uplink.12345
    Comms Relay                                       : Comms_Relay.12345
    Comms Jammer                                      : Comms_Jammer.12345
    Improvised Orders                                 : Improvised_Orders.12345
    Esteemed Leader                                   : Esteemed_Leader.12345
    Tenacity                                          : Tenacity.12345
    Hunter                                            : Hunter.12345
    Duck and Cover                                    : Duck_and_Cover.12345
    Wedge Antilles                                    : Wedge_Antilles.12345
    General Weiss                                     : General_Weiss.12345
    Stormtrooper                                      : Stormtrooper.12345
    Snowtrooper                                       : Snowtrooper.12345
    R5 Astromech Droid                                : R5_Astromech_Droid.12345
    R4 Astromech Droid                                : R4_Astromech_Droid.12345
    Rebel Comms Technician                            : Rebel_Comms_Technician.12345
    Rebel Trooper                                     : Rebel_Trooper.12345
    Z-6 Trooper                                       : Z-6_Trooper.12345
    T-7 Ion Snowtrooper                               : T-7_Ion_Snowtrooper.12345
    Imperial Comms Technician                         : Imperial_Comms_Technician.12345
    FX-9 Medical Droid                                : FX-9_Medical_Droid.12345
    Fleet Trooper                                     : Fleet_Trooper.12345
    2-1B Medical Droid                                : 2-1B_Medical_Droid.12345
    Sonic Charge Saboteur                             : Sonic_Charge_Saboteur.12345
    Scatter Gun Trooper                               : Scatter_Gun_Trooper.12345
    Proton Charge Saboteur                            : Proton_Charge_Saboteur.12345
    DLT-19x Sniper                                    : DLT-19x_Sniper.12345
    DLT-19 Stormtrooper                               : DLT-19_Stormtrooper.12345
    Electrostaff Guard                                : Electrostaff_Guard.12345
    MPL-57 Barrage Trooper                            : MPL-57_Barrage_Trooper.12345
    DH-447 Sniper                                     : DH-447_Sniper.12345
    HH-12 Stormtrooper                                : HH-12_Stormtrooper.12345
    MPL-57 Ion Trooper                                : MPL-57_Ion_Trooper.12345
    Flametrooper                                      : Flametrooper.12345
    Mo/Dk Power Harpoon                               : Mo_Dk_Power_Harpoon.12345
    Bowcaster Wookiee                                 : Bowcaster_Wookiee.12345
    AT-RT Rotary Blaster                              : AT-RT_Rotary_Blaster.12345
    AT-RT Laser Cannon                                : AT-RT_Laser_Cannon.12345
    AT-RT Flamethrower                                : AT-RT_Flamethrower.12345
    AT-ST Mortar Launcher                             : AT-ST_Mortar_Launcher.12345
    DW-3 Concussion Grenade Launcher                  : DW-3_Concussion_Grenade_Launcher.12345
    88 Twin Light Blaster Cannon                      : 88_Twin_Light_Blaster_Cannon.12345
    Ax-108 \\"Ground Buzzer\\"                            : Ax-108_Ground_Buzzer.12345
    Fragmentation Grenades                            : Fragmentation_Grenades.12345
    Force Reflexes                                    : Force_Reflexes.12345
    Emergency Stims                                   : Emergency_Stims.12345
    Targeting Scopes                                  : Targeting_Scopes.12345
    Grappling Hooks                                   : Grappling_Hooks.12345
    Concussion Grenades                               : Concussion_Grenades.12345
    Saber Throw                                       : Saber_Throw.12345
    Impact Grenades                                   : Impact_Grenades.12345
    Jedi Mind Trick                                   : Jedi_Mind_Trick.12345
    Recon Intel                                       : Recon_Intel.12345
    A-300                                             : A-300.12345
    A-180                                             : A-180.12345
    E-11D                                             : E-11D.12345
    Environmental Gear                                : Environmental_Gear.12345
    Ryder Azadi                                       : Ryder_Azadi.12345
    Imperial Hammers Elite Armor Pilot                : Imperial_Hammers_Elite_Armor_Pilot.12345
    Outer Rim Speeder Jockey                          : Outer_Rim_Speeder_Jockey.12345
    Overwatch                                         : Overwatch.12345
    Bistan                                            : Bistan.12345
    Pao                                               : Pao.12345
    DLT-19D Trooper                                   : DLT-19D_Trooper.12345
    Electro Grappling Line                            : Electro_Grappling_Line.12345
    Smoke Grenades                                    : Smoke_Grenades.12345
    CM-0/93 Trooper                                   : CM-0_93_Trooper.12345
    Linked Targeting Array                            : Linked_Targeting_Array.12345
    Rebel Veteran                                     : Rebel_Veteran.12345
    DLT-19 Rifle Pintle                               : DLT-19_Rifle_Pintle.12345
    RT-97C Rifle Pintle                               : RT-97C_Rifle_Pintle.12345
    RPS-6 Rocket Gunner                               : RPS-6_Rocket_Gunner.12345
    Mark II Medium Blaster                            : Mark_II_Medium_Blaster.12345
    A-300 Rifle Gunner                                : A-300_Rifle_Gunner.12345
    M-45 Ion Blaster                                  : M-45_Ion_Blaster.12345
    Barrage Generator                                 : Barrage_Generator.12345
    Z-6 Phase II Trooper                              : Z-6_Phase_II_Trooper.12345
    B2-ACM Trooper                                    : B2-ACM_Trooper.12345
    TX-130 Beam Cannon Turret                         : TX-130_Beam_Cannon_Turret.12345
    TX-130 Twin Laser Turret                          : TX-130_Twin_Laser_Turret.12345
    Armor-Piercing Shells                             : Armor-Piercing_Shells.12345
    Plo Koon                                          : Plo_Koon.12345
    Veteran Clone Pilot                               : Veteran_Clone_Pilot.12345
    Lok Durd                                          : Lok_Durd.12345
    High-Energy Shells                                : High-Energy_Shells.12345
    \\"Bunker Buster\\" Shells                            : Bunker_Buster_Shells.12345
    T-Series Tactical Droid Pilot                     : T-Series_Tactical_Droid_Pilot.12345
    OOM-Series Droid Pilot                            : OOM-Series_Droid_Pilot.12345
    Aayla Secura                                      : Aayla_Secura.12345
    B2-HA Trooper                                     : B2-HA_Trooper.12345
    Phase II Mortar Trooper                           : Phase_II_Mortar_Trooper.12345
    Shoretrooper                                      : Shoretrooper.12345
    T-21B Trooper                                     : T-21B_Trooper.12345
    RT-97C Blaster Rifle                              : RT-97C_Blaster_Rifle.12345
    T-21 Blaster Rifle                                : T-21_Blaster_Rifle.12345
    CR-24 Flame Rifle                                 : CR-24_Flame_Rifle.12345
    Fear                                              : Fear.12345
    First Sergeant Arbmab                             : First_Sergeant_Arbmab.12345
    Strict Orders                                     : Strict_Orders.12345
    The Darksaber                                     : The_Darksaber.12345
    Endurance                                         : Endurance.12345
    Offensive Push                                    : Offensive_Push.12345
    Electrobinoculars                                 : Electrobinoculars.12345
    DT-F16                                            : DT-F16.12345
    Personal Combat Shield                            : Personal_Combat_Shield.12345
    Integrated Comms Antenna                          : Integrated_Comms_Antenna.12345
    A-280-CFE Sniper Config                           : A-280-CFE_Sniper_Config.12345
    JT-12 Jetpacks                                    : JT-12_Jetpacks.12345
    EMP Droid Poppers                                 : EMP_Droid_Poppers.12345
    Vibroswords                                       : Vibroswords.12345
    Deflector Shields                                 : Deflector_Shields.12345
    Jyns SE-14 Blaster                                : Jyns_SE-14_Blaster.12345
    Idens TL-50 Repeater                              : Idens_TL-50_Repeater.12345
    Idens DLT-20A Rifle                               : Idens_DLT-20A_Rifle.12345
    BX-Series Droid Sniper                            : BX-Series_Droid_Sniper.12345
    DC-15x ARC Trooper                                : DC-15x_ARC_Trooper.12345
    Command Control Array                             : Command_Control_Array.12345
    Looted E-5 Blaster                                : Looted_E-5_Blaster.12345
    Electro Gauntlets                                 : Electro_Gauntlets.12345
    Red D8                                            : Red_D8.12345
    Black D8                                          : Black_D8.12345
    White D8                                          : White_D8.12345
    D6                                                : D6.12345
    Wound Tokens                                      : Wound_Tokens.12345
    Turn Counter                                      : Turn_Counter.12345
    Learning Game                                     : Learning_Game.12345
    Blue Rebel Trooper                                : Blue_Rebel_Trooper.12345
    Red 74-Z Speeder Bike                             : Red_74-Z_Speeder_Bike.12345
    Red Darth Vader                                   : Red_Darth_Vader.12345
    Red Stormtrooper                                  : Red_Stormtrooper.12345
    Red Stormtrooper Leader                           : Red_Stormtrooper_Leader.12345
    Blue AT-RT                                        : Blue_AT-RT.12345
    Blue Rebel Trooper Leader                         : Blue_Rebel_Trooper_Leader.12345
    Red 74-Z Speeder Bike Leader                      : Red_74-Z_Speeder_Bike_Leader.12345
    TABLE                                             : TABLE.12345
    Blue Luke Skywalker                               : Blue_Luke_Skywalker.12345
    Red Imperial Support Command Token                : Red_Imperial_Support_Command_Token.12345
    Red Imperial Corps Command Token                  : Red_Imperial_Corps_Command_Token.12345
    Red Imperial Commander Command Token              : Red_Imperial_Commander_Command_Token.12345
    Blue Rebel Support Command Token                  : Blue_Rebel_Support_Command_Token.12345
    Blue Rebel Corps Command Token                    : Blue_Rebel_Corps_Command_Token.12345
    Blue Rebel Commander Command Token                : Blue_Rebel_Commander_Command_Token.12345
    Red List Builder Option 4                         : Red_List_Builder_Option_4.12345
    Red List Builder Option 4 Button                  : Red_List_Builder_Option_4_Button.12345
    Blue List Builder Option 4                        : Blue_List_Builder_Option_4.12345
    Blue List Builder Option 4 Button                 : Blue_List_Builder_Option_4_Button.12345
    RED DATA DISK MOUNT                               : RED_DATA_DISK_MOUNT.12345
    BLUE DATA DISK MOUNT                              : BLUE_DATA_DISK_MOUNT.12345
    Surge Tokens                                      : Surge_Tokens.12345
    Surge Token                                       : Surge_Token.12345
    Smoke Tokens                                      : Smoke_Tokens.12345
    Smoke Token                                       : Smoke_Token.12345
    Graffiti Tokens                                   : Graffiti_Tokens.12345
    Graffiti Token                                    : Graffiti_Token.12345
    Shield Tokens                                     : Shield_Tokens.12345
    Shield Token                                      : Shield_Token.12345
    Poison Tokens                                     : Poison_Tokens.12345
    Poison Token                                      : Poison_Token.12345
    Wheel Mode Tokens                                 : Wheel_Mode_Tokens.12345
    Wheel Mode Token                                  : Wheel_Mode_Token.12345
    Skirmish Card Decks                               : Skirmish_Card_Decks.12345
    Dawn                                              : Dawn.12345
    Improvised Defenses                               : Improvised_Defenses.12345
    Faceoff                                           : Faceoff.12345
    Flanking Positions                                : Flanking_Positions.12345
    Meeting Engagement                                : Meeting_Engagement.12345
    Breach                                            : Breach.12345
    Control                                           : Control.12345
    Elimination                                       : Elimination.12345
    Pivotal Positions                                 : Pivotal_Positions.12345
    Silhouette Markers                                : Silhouette_Markers.12345
    Silhouette with base                              : Silhouette_with_base.12345
    Silhouette                                        : Silhouette.12345
    Vital Assets                                      : Vital_Assets.12345
    Deployments                                       : Deployments.12345
    Supply Deck                                       : Supply_Deck.12345
    Hostages                                          : Hostages.12345
    All Cards                                         : All_Cards.12345
    Battlefield Deck                                  : Battlefield_Deck.12345
    Units                                             : Units.12345
    Upgrades                                          : Upgrades.12345
    Command Cards                                     : Command_Cards.12345
    2.15.0: Vital Assets Preview                      : 2.15.0_Vital_Assets_Preview.12345
    Blank Order Tokens                                : Blank_Order_Tokens.12345
    Blank Order Token                                 : Blank_Order_Token.12345"
  `);
});
